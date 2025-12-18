import type { InputFormat, ConversionResult } from '@/types';
import { JsonConverter } from './json';
import { YamlConverter } from './yaml';
import { TextConverter } from './text';
import { HtmlConverter } from './html';
import { ReactConverter } from './react';

/**
 * Main converter orchestrator with auto-detection
 */
export class ToonConverter {
    private converters = {
        react: new ReactConverter(),
        html: new HtmlConverter(),
        json: new JsonConverter(),
        yaml: new YamlConverter(),
        text: new TextConverter(),
    };

    /**
     * Auto-detect input format
     */
    detectFormat(input: string): InputFormat {
        if (!input.trim()) return 'text';

        // Order matters: check more specific formats first
        if (this.converters.react.detect(input)) return 'react';
        if (this.converters.html.detect(input)) return 'html';
        if (this.converters.json.detect(input)) return 'json';
        if (this.converters.yaml.detect(input)) return 'yaml';

        return 'text';
    }

    /**
     * Convert input to TOON format
     */
    convert(input: string, format: InputFormat = 'auto'): ConversionResult {
        if (!input.trim()) {
            return {
                tokens: '',
                tokenCount: 0,
                inputTokenEstimate: 0,
                format: 'text',
            };
        }

        // Auto-detect if needed
        const detectedFormat = format === 'auto' ? this.detectFormat(input) : format;

        // Get the appropriate converter (detectedFormat is never 'auto' here)
        const converter = this.converters[detectedFormat as keyof typeof this.converters];

        // Convert to TOON
        const tokens = converter.convert(input);

        // Calculate token estimates
        const inputTokenEstimate = this.estimateTokens(input);
        const tokenCount = this.estimateTokens(tokens);

        return {
            tokens,
            tokenCount,
            inputTokenEstimate,
            format: detectedFormat,
        };
    }

    /**
     * Estimate token count (rough approximation: 1 token ≈ 4 characters)
     */
    private estimateTokens(text: string): number {
        return Math.ceil(text.length / 4);
    }
}

// Export singleton instance
export const toonConverter = new ToonConverter();
