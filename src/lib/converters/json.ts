import { BaseConverter } from './base';

/**
 * JSON to TOON converter
 */
export class JsonConverter extends BaseConverter {
    detect(input: string): boolean {
        try {
            const trimmed = input.trim();
            if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
                return false;
            }
            JSON.parse(trimmed);
            return true;
        } catch {
            return false;
        }
    }

    convert(input: string): string {
        try {
            const data = JSON.parse(input);
            const lines: string[] = [];
            this.processValue(data, lines, '', 0);
            return lines.join('\n');
        } catch (error) {
            return `ERROR Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    private processValue(
        value: any,
        lines: string[],
        key: string,
        indent: number
    ): void {
        if (value === null) {
            lines.push(this.createLine(this.toUpperSnake(key), 'NULL', indent));
            return;
        }

        if (typeof value === 'boolean') {
            lines.push(this.createLine(this.toUpperSnake(key), value.toString().toUpperCase(), indent));
            return;
        }

        if (typeof value === 'number') {
            lines.push(this.createLine(this.toUpperSnake(key), value.toString(), indent));
            return;
        }

        if (typeof value === 'string') {
            lines.push(this.createLine(this.toUpperSnake(key), this.sanitize(value), indent));
            return;
        }

        if (Array.isArray(value)) {
            if (key) {
                lines.push(this.createLine(this.toUpperSnake(key), 'ARRAY', indent));
            }
            value.forEach((item, index) => {
                lines.push(this.createLine('ITEM', index.toString(), indent + 1));
                this.processValue(item, lines, '', indent + 2);
            });
            return;
        }

        if (typeof value === 'object') {
            if (key) {
                lines.push(this.createLine(this.toUpperSnake(key), 'OBJECT', indent));
            }
            Object.entries(value).forEach(([k, v]) => {
                this.processValue(v, lines, k, indent + (key ? 1 : 0));
            });
            return;
        }
    }
}
