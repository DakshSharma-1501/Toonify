import { BaseConverter } from './base';

/**
 * HTML to TOON converter
 * Parses HTML and extracts semantic structure
 */
export class HtmlConverter extends BaseConverter {
    detect(input: string): boolean {
        const trimmed = input.trim();
        return /^<[^>]+>/.test(trimmed) || /<\/[^>]+>$/.test(trimmed);
    }

    convert(input: string): string {
        try {
            const lines: string[] = [];
            this.parseHtml(input, lines, 0);
            return lines.join('\n');
        } catch (error) {
            return `ERROR Invalid HTML: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    private parseHtml(html: string, lines: string[], indent: number): void {
        // Remove comments
        html = html.replace(/<!--[\s\S]*?-->/g, '');

        // Match tags
        const tagRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>|<(\w+)([^>]*)\s*\/>/g;
        let match;

        while ((match = tagRegex.exec(html)) !== null) {
            const [fullMatch, tag, attrs, content, selfClosingTag, selfClosingAttrs] = match;

            if (selfClosingTag) {
                // Self-closing tag
                lines.push(this.createLine('ELEMENT', selfClosingTag.toUpperCase(), indent));
                this.parseAttributes(selfClosingAttrs, lines, indent + 1);
            } else {
                // Regular tag
                lines.push(this.createLine('ELEMENT', tag.toUpperCase(), indent));

                // Parse attributes
                if (attrs) {
                    this.parseAttributes(attrs, lines, indent + 1);
                }

                // Parse content
                if (content) {
                    const trimmedContent = content.trim();

                    // Check if content has nested tags
                    if (/<[^>]+>/.test(trimmedContent)) {
                        this.parseHtml(trimmedContent, lines, indent + 1);
                    } else if (trimmedContent) {
                        // Text content
                        lines.push(this.createLine('TEXT', this.sanitize(trimmedContent), indent + 1));
                    }
                }
            }
        }

        // Handle text nodes without tags
        const textOnly = html.replace(/<[^>]+>/g, '').trim();
        if (textOnly && !tagRegex.test(html)) {
            lines.push(this.createLine('TEXT', this.sanitize(textOnly), indent));
        }
    }

    private parseAttributes(attrs: string, lines: string[], indent: number): void {
        // Parse class
        const classMatch = attrs.match(/class=["']([^"']+)["']/);
        if (classMatch) {
            lines.push(this.createLine('CLASS', classMatch[1], indent));
        }

        // Parse id
        const idMatch = attrs.match(/id=["']([^"']+)["']/);
        if (idMatch) {
            lines.push(this.createLine('ID', idMatch[1], indent));
        }

        // Parse event handlers
        const eventRegex = /on(\w+)=["']([^"']+)["']/g;
        let eventMatch;
        while ((eventMatch = eventRegex.exec(attrs)) !== null) {
            const [, eventName, handler] = eventMatch;
            lines.push(this.createLine('EVENT', `on${eventName} ${this.sanitize(handler)}`, indent));
        }

        // Parse other attributes
        const attrRegex = /(\w+)=["']([^"']+)["']/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrs)) !== null) {
            const [, name, value] = attrMatch;
            if (!['class', 'id'].includes(name) && !name.startsWith('on')) {
                lines.push(this.createLine('ATTR', `${name} ${this.sanitize(value)}`, indent));
            }
        }
    }
}
