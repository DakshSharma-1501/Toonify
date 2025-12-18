import type { Converter } from '@/types';

/**
 * Base converter class with shared utilities
 */
export abstract class BaseConverter implements Converter {
    abstract detect(input: string): boolean;
    abstract convert(input: string): string;

    /**
     * Estimate token count (rough approximation: 1 token ≈ 4 characters)
     */
    protected estimateTokens(text: string): number {
        return Math.ceil(text.length / 4);
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
