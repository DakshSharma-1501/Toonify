import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { BaseConverter } from './base';

/**
 * React/JSX to TOON converter
 * Uses Babel to parse and extract component structure including hooks
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

            // Compact output to reduce token count
            const compacted = this.compactOutput(lines);
            return compacted.join('\n') || 'COMPONENT (empty)';
        } catch (error) {
            return `ERROR Invalid React/JSX: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    private traverseAST(ast: t.File, lines: string[]): void {
        traverse(ast, {
            FunctionDeclaration: (path) => {
                const name = path.node.id?.name;
                if (name && /^[A-Z]/.test(name)) {
                    lines.push(this.createLine('COMPONENT', name));
                    this.extractProps(path.node.params, lines, 1);
                    this.extractComponentBody(path, lines, 1);
                }
            },

            VariableDeclarator: (path) => {
                if (!t.isIdentifier(path.node.id)) return;

                const name = path.node.id.name;
                if (name && /^[A-Z]/.test(name)) {
                    if (
                        t.isArrowFunctionExpression(path.node.init) ||
                        t.isFunctionExpression(path.node.init)
                    ) {
                        lines.push(this.createLine('COMPONENT', name));
                        this.extractProps(path.node.init.params, lines, 1);

                        // Get the function path for body extraction
                        const funcPath = path.get('init') as NodePath<t.ArrowFunctionExpression | t.FunctionExpression>;
                        this.extractComponentBody(funcPath, lines, 1);
                    }
                }
            },

            JSXElement: (path) => {
                // Only process top-level JSX elements (not inside components)
                if (!path.findParent((p) => p.isJSXElement()) &&
                    !path.findParent((p) => p.isFunctionDeclaration() || p.isArrowFunctionExpression())) {
                    this.processJSXElement(path.node, lines, 0);
                }
            },
        });
    }

    private extractProps(params: Array<t.Identifier | t.Pattern | t.RestElement>, lines: string[], indent: number): void {
        params.forEach((param) => {
            if (t.isIdentifier(param)) {
                lines.push(this.createLine('PROP', param.name, indent));
            } else if (t.isObjectPattern(param)) {
                param.properties.forEach((prop) => {
                    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                        lines.push(this.createLine('PROP', prop.key.name, indent));
                    }
                });
            }
        });
    }

    private extractComponentBody(
        path: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression | t.FunctionExpression>,
        lines: string[],
        indent: number
    ): void {
        // Extract hooks first
        this.extractHooks(path, lines, indent);

        // Extract function declarations
        this.extractFunctions(path, lines, indent);

        // Extract variable declarations
        this.extractVariables(path, lines, indent);

        // Extract JSX return
        this.extractJSXFromFunction(path, lines, indent);
    }

    private extractHooks(
        path: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression | t.FunctionExpression>,
        lines: string[],
        indent: number
    ): void {
        path.traverse({
            CallExpression: (callPath) => {
                // Only process hooks at the top level of the component
                if (callPath.getFunctionParent() !== path) return;

                const callee = callPath.node.callee;
                if (!t.isIdentifier(callee)) return;

                const hookName = callee.name;

                // Handle useState
                if (hookName === 'useState') {
                    const parent = callPath.parent;
                    if (t.isVariableDeclarator(parent) && t.isArrayPattern(parent.id)) {
                        const elements = parent.id.elements;
                        if (elements.length > 0 && t.isIdentifier(elements[0])) {
                            const stateName = elements[0].name;
                            const initialValue = this.getCallArgument(callPath.node, 0);
                            lines.push(this.createLine('HOOK', `useState ${stateName} ${initialValue}`, indent));
                        }
                    }
                }
                // Handle useEffect
                else if (hookName === 'useEffect') {
                    const deps = this.getEffectDependencies(callPath.node);
                    lines.push(this.createLine('HOOK', `useEffect ${deps}`, indent));

                    // Extract function body from useEffect
                    const callback = callPath.node.arguments[0];
                    if (t.isArrowFunctionExpression(callback) || t.isFunctionExpression(callback)) {
                        this.extractFunctionBody(callback.body, lines, indent + 1);
                    }
                }
                // Handle other common hooks
                else if (['useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer'].includes(hookName)) {
                    const parent = callPath.parent;
                    let varName = '';

                    if (t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) {
                        varName = parent.id.name;
                    }

                    const deps = hookName === 'useCallback' || hookName === 'useMemo'
                        ? this.getEffectDependencies(callPath.node)
                        : '';

                    lines.push(this.createLine('HOOK', `${hookName} ${varName} ${deps}`.trim(), indent));
                }
            },
        });
    }

    private extractFunctions(
        path: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression | t.FunctionExpression>,
        lines: string[],
        indent: number
    ): void {
        path.traverse({
            FunctionDeclaration: (funcPath) => {
                // Only process functions directly in the component body
                if (funcPath.getFunctionParent() !== path) return;

                const name = funcPath.node.id?.name || 'anonymous';
                lines.push(this.createLine('FUNCTION', name, indent));
            },
        });
    }

    private extractVariables(
        path: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression | t.FunctionExpression>,
        lines: string[],
        indent: number
    ): void {
        path.traverse({
            VariableDeclaration: (varPath) => {
                // Only process variables directly in the component body
                if (varPath.getFunctionParent() !== path) return;

                // Skip hook declarations (already handled)
                const isHook = varPath.node.declarations.some(decl => {
                    if (t.isCallExpression(decl.init)) {
                        const callee = decl.init.callee;
                        if (t.isIdentifier(callee) && callee.name.startsWith('use')) {
                            return true;
                        }
                    }
                    return false;
                });

                if (isHook) return;

                varPath.node.declarations.forEach(decl => {
                    if (t.isIdentifier(decl.id)) {
                        const value = this.getVariableValue(decl.init);
                        lines.push(this.createLine('VARIABLE', `${decl.id.name} ${value}`, indent));
                    }
                });
            },
        });
    }

    private extractFunctionBody(body: t.BlockStatement | t.Expression, lines: string[], indent: number): void {
        if (t.isBlockStatement(body)) {
            body.body.forEach(statement => {
                if (t.isExpressionStatement(statement)) {
                    const expr = this.getExpressionValue(statement.expression);
                    if (expr && expr !== 'expression') {
                        lines.push(this.createLine('CALL', expr, indent));
                    }
                } else if (t.isFunctionDeclaration(statement)) {
                    const name = statement.id?.name || 'anonymous';
                    lines.push(this.createLine('FUNCTION', name, indent));
                }
            });
        }
    }

    private extractJSXFromFunction(
        path: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression | t.FunctionExpression>,
        lines: string[],
        indent: number
    ): void {
        path.traverse({
            JSXElement: (jsxPath) => {
                // Only get direct return JSX from this component
                const returnStatement = jsxPath.findParent(p => p.isReturnStatement());
                if (returnStatement && returnStatement.getFunctionParent() === path) {
                    this.processJSXElement(jsxPath.node, lines, indent);
                    jsxPath.skip(); // Don't traverse children again
                }
            },
        });
    }

    private processJSXElement(element: t.JSXElement, lines: string[], indent: number): void {
        const tagName = this.getJSXTagName(element.openingElement.name);

        if (tagName) {
            lines.push(this.createLine('RENDER', tagName.toUpperCase(), indent));

            // Process attributes
            element.openingElement.attributes.forEach((attr) => {
                if (t.isJSXAttribute(attr)) {
                    const name = t.isJSXIdentifier(attr.name) ? attr.name.name : '';

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
            element.children.forEach((child) => {
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

    private getJSXTagName(name: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName): string | null {
        if (t.isJSXIdentifier(name)) {
            return name.name;
        }
        if (t.isJSXMemberExpression(name)) {
            const object = this.getJSXTagName(name.object as t.JSXIdentifier | t.JSXMemberExpression);
            return `${object}.${name.property.name}`;
        }
        return null;
    }

    private getAttributeValue(value: t.JSXAttribute['value']): string {
        if (!value) return 'true';
        if (t.isStringLiteral(value)) return value.value;
        if (t.isJSXExpressionContainer(value)) {
            return this.getExpressionValue(value.expression);
        }
        return 'unknown';
    }

    private getExpressionValue(expr: t.Expression | t.JSXEmptyExpression): string {
        if (t.isJSXEmptyExpression(expr)) return '';
        if (t.isIdentifier(expr)) return expr.name;
        if (t.isMemberExpression(expr)) {
            const obj = this.getExpressionValue(expr.object as t.Expression);
            const prop = t.isIdentifier(expr.property) ? expr.property.name : 'unknown';
            return `${obj}.${prop}`;
        }
        if (t.isCallExpression(expr)) {
            const callee = this.getExpressionValue(expr.callee as t.Expression);
            return `${callee}()`;
        }
        if (t.isStringLiteral(expr)) return expr.value;
        if (t.isNumericLiteral(expr)) return expr.value.toString();
        if (t.isBooleanLiteral(expr)) return expr.value.toString();
        return 'expression';
    }

    private getCallArgument(node: t.CallExpression, index: number): string {
        const arg = node.arguments[index];
        if (!arg) return '';
        if (t.isExpression(arg)) {
            return this.getExpressionValue(arg);
        }
        return '';
    }

    private getEffectDependencies(node: t.CallExpression): string {
        const depsArg = node.arguments[1];
        if (!depsArg) return '';

        if (t.isArrayExpression(depsArg)) {
            if (depsArg.elements.length === 0) return '[]';

            const deps = depsArg.elements
                .map(el => {
                    if (t.isExpression(el)) {
                        return this.getExpressionValue(el);
                    }
                    return null;
                })
                .filter(Boolean)
                .join(', ');

            return `[${deps}]`;
        }

        return '';
    }

    private getVariableValue(init: t.Expression | null | undefined): string {
        if (!init) return '';
        return this.getExpressionValue(init);
    }
}
