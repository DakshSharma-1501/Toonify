import type { Converter } from '@/types';

/**
 * Base converter class with shared utilities
 */
export abstract class BaseConverter implements Converter {
    abstract detect(input: string): boolean;
    abstract convert(input: string): string;

    /**
     * Estimate token count with improved accuracy
     * - Normalizes whitespace before counting
     * - Uses 1 token ≈ 3.5 characters for code (more accurate for LLMs)
     */
    protected estimateTokens(text: string): number {
        // Normalize whitespace: trim and collapse multiple spaces
        const normalized = text
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n'); // Remove blank lines

        // Use 3.5 character ratio for better accuracy with code
        return Math.ceil(normalized.length / 3.5);
    }

    /**
     * Compact output by removing unnecessary whitespace
     */
    protected compactOutput(lines: string[]): string[] {
        return lines
            .map(line => line.trimEnd()) // Remove trailing spaces
            .filter((line, index, arr) => {
                // Remove consecutive blank lines
                if (line.trim() === '') {
                    return index === 0 || arr[index - 1].trim() !== '';
                }
                return true;
            });
    }

    /**
     * Normalize whitespace and trim
     */
    protected normalize(text: string): string {
        return text.trim().replace(/\s+/g, ' ');
    }

    /**
     * Convert camelCase or PascalCase to UPPER_SNAKE_CASE
     */
    protected toUpperSnake(str: string): string {
        return str
            .replace(/([A-Z])/g, '_$1')
            .replace(/^_/, '')
            .toUpperCase()
            .replace(/\s+/g, '_');
    }

    /**
     * Sanitize string for TOON output
     */
    protected sanitize(str: string): string {
        return str.replace(/\n/g, ' ').trim();
    }

    /**
     * Create indented TOON line
     */
    protected createLine(keyword: string, value?: string, indent: number = 0): string {
        const indentation = '  '.repeat(indent);
        if (value) {
            return `${indentation}${keyword} ${value}`;
        }
        return `${indentation}${keyword}`;
    }
}
