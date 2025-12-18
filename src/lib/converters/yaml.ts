import { parse } from 'yaml';
import { BaseConverter } from './base';
import { JsonConverter } from './json';

/**
 * YAML to TOON converter
 * Parses YAML and delegates to JSON converter
 */
export class YamlConverter extends BaseConverter {
    private jsonConverter = new JsonConverter();

    detect(input: string): boolean {
        try {
            const trimmed = input.trim();
            // YAML often starts with --- or has key: value format
            if (trimmed.startsWith('---') || /^\w+:\s*.+/m.test(trimmed)) {
                parse(trimmed);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    convert(input: string): string {
        try {
            const data = parse(input);
            const jsonString = JSON.stringify(data);
            return this.jsonConverter.convert(jsonString);
        } catch (error) {
            return `ERROR Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}
