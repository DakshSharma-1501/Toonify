import { BaseConverter } from './base';

/**
 * Plain text to TOON converter
 * Extracts semantic structure from text
 */
export class TextConverter extends BaseConverter {
    detect(input: string): boolean {
        // Text is the fallback format
        return true;
    }

    convert(input: string): string {
        const lines: string[] = [];
        const paragraphs = input.split(/\n\n+/);

        paragraphs.forEach((para, index) => {
            const trimmed = para.trim();
            if (!trimmed) return;

            // Check if it's a heading (all caps, short, or ends with :)
            if (this.isHeading(trimmed)) {
                lines.push(this.createLine('HEADING', this.sanitize(trimmed)));
                return;
            }

            // Check if it's a list item
            if (this.isListItem(trimmed)) {
                const content = trimmed.replace(/^[-*•]\s*/, '');
                lines.push(this.createLine('ITEM', this.sanitize(content)));
                return;
            }

            // Check if it's a key-value pair
            const kvMatch = trimmed.match(/^([^:]+):\s*(.+)$/);
            if (kvMatch) {
                const [, key, value] = kvMatch;
                lines.push(this.createLine(this.toUpperSnake(key.trim()), this.sanitize(value)));
                return;
            }

            // Regular paragraph
            lines.push(this.createLine('TEXT', this.sanitize(trimmed)));
        });

        return lines.join('\n') || 'TEXT (empty)';
    }

    private isHeading(text: string): boolean {
        return (
            text.length < 50 &&
            (text === text.toUpperCase() || text.endsWith(':') || /^#+\s/.test(text))
        );
    }

    private isListItem(text: string): boolean {
        return /^[-*•]\s/.test(text);
    }
}
