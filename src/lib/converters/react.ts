import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { BaseConverter } from './base';

/**
 * React/JSX to TOON converter
 * Uses Babel to parse and extract component structure
 */
export class ReactConverter extends BaseConverter {
    detect(input: string): boolean {
        // Check for JSX syntax or React patterns
        return (
            /<[A-Z]/.test(input) || // JSX component
            /function\s+[A-Z]\w*\s*\(/.test(input) || // Function component
            /const\s+[A-Z]\w*\s*=/.test(input) || // Const component
            /import.*from\s+['"]react['"]/.test(input) // React import
        );
    }

    convert(input: string): string {
        try {
            const ast = parse(input, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript'],
            });

            const lines: string[] = [];
            this.traverseAST(ast, lines);

            return lines.join('\n') || 'COMPONENT (empty)';
        } catch (error) {
            return `ERROR Invalid React/JSX: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    private traverseAST(ast: any, lines: string[]): void {
        traverse(ast, {
            FunctionDeclaration: (path) => {
                const name = path.node.id?.name;
                if (name && /^[A-Z]/.test(name)) {
                    lines.push(this.createLine('COMPONENT', name));
                    this.extractProps(path.node.params, lines, 1);
                    this.extractJSXFromFunction(path, lines, 1);
                }
            },

            VariableDeclarator: (path) => {
                const name = (path.node.id as any).name;
                if (name && /^[A-Z]/.test(name)) {
                    if (
                        t.isArrowFunctionExpression(path.node.init) ||
                        t.isFunctionExpression(path.node.init)
                    ) {
                        lines.push(this.createLine('COMPONENT', name));
                        const func = path.node.init as any;
                        this.extractProps(func.params, lines, 1);
                        this.extractJSXFromFunction(path, lines, 1);
                    }
                }
            },

            JSXElement: (path) => {
                // Only process top-level JSX elements
                if (!path.findParent((p) => p.isJSXElement())) {
                    this.processJSXElement(path.node, lines, 0);
                }
            },
        });
    }

    private extractProps(params: any[], lines: string[], indent: number): void {
        params.forEach((param) => {
            if (t.isIdentifier(param)) {
                lines.push(this.createLine('PROP', param.name, indent));
            } else if (t.isObjectPattern(param)) {
                param.properties.forEach((prop: any) => {
                    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                        lines.push(this.createLine('PROP', prop.key.name, indent));
                    }
                });
            }
        });
    }

    private extractJSXFromFunction(path: any, lines: string[], indent: number): void {
        path.traverse({
            JSXElement: (jsxPath: any) => {
                // Only get direct return JSX
                if (jsxPath.findParent((p: any) => p === path)) {
                    this.processJSXElement(jsxPath.node, lines, indent);
                }
            },
        });
    }

    private processJSXElement(element: any, lines: string[], indent: number): void {
        const tagName = this.getJSXTagName(element.openingElement.name);

        if (tagName) {
            lines.push(this.createLine('RENDER', tagName.toUpperCase(), indent));

            // Process attributes
            element.openingElement.attributes.forEach((attr: any) => {
                if (t.isJSXAttribute(attr)) {
                    const name = (attr.name as any).name;

                    if (name.startsWith('on')) {
                        // Event handler
                        const value = this.getAttributeValue(attr.value);
                        lines.push(this.createLine('EVENT', `${name} ${value}`, indent + 1));
                    } else if (name === 'className') {
                        const value = this.getAttributeValue(attr.value);
                        lines.push(this.createLine('CLASS', value, indent + 1));
                    } else {
                        const value = this.getAttributeValue(attr.value);
                        lines.push(this.createLine('PROP', `${name} ${value}`, indent + 1));
                    }
                }
            });

            // Process children
            element.children.forEach((child: any) => {
                if (t.isJSXText(child)) {
                    const text = child.value.trim();
                    if (text) {
                        lines.push(this.createLine('TEXT', this.sanitize(text), indent + 1));
                    }
                } else if (t.isJSXExpressionContainer(child)) {
                    const expr = this.getExpressionValue(child.expression);
                    if (expr) {
                        lines.push(this.createLine('DYNAMIC', expr, indent + 1));
                    }
                } else if (t.isJSXElement(child)) {
                    lines.push(this.createLine('CHILD', '', indent + 1));
                    this.processJSXElement(child, lines, indent + 2);
                }
            });
        }
    }

    private getJSXTagName(name: any): string | null {
        if (t.isJSXIdentifier(name)) {
            return name.name;
        }
        if (t.isJSXMemberExpression(name)) {
            return `${this.getJSXTagName(name.object)}.${name.property.name}`;
        }
        return null;
    }

    private getAttributeValue(value: any): string {
        if (!value) return 'true';
        if (t.isStringLiteral(value)) return value.value;
        if (t.isJSXExpressionContainer(value)) {
            return this.getExpressionValue(value.expression);
        }
        return 'unknown';
    }

    private getExpressionValue(expr: any): string {
        if (t.isIdentifier(expr)) return expr.name;
        if (t.isMemberExpression(expr)) {
            const obj = this.getExpressionValue(expr.object);
            const prop = t.isIdentifier(expr.property) ? expr.property.name : 'unknown';
            return `${obj}.${prop}`;
        }
        if (t.isCallExpression(expr)) {
            const callee = this.getExpressionValue(expr.callee);
            return `${callee}()`;
        }
        if (t.isStringLiteral(expr)) return expr.value;
        if (t.isNumericLiteral(expr)) return expr.value.toString();
        if (t.isBooleanLiteral(expr)) return expr.value.toString();
        return 'expression';
    }
}
