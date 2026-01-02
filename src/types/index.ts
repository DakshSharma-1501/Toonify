// Input format types
export type InputFormat = 'json' | 'yaml' | 'text' | 'html' | 'react' | 'auto';

// TOON token structure
export interface ToonToken {
    type: string;
    value: string;
    indent?: number;
}

// Converter result
export interface ConversionResult {
    tokens: string;
    tokenCount: number;
    inputTokenEstimate: number;
    format: InputFormat;
}

// Converter interface
export interface Converter {
    detect(input: string): boolean;
    convert(input: string): string;
}

// Parser options
export interface ParserOptions {
    format?: InputFormat;
    preserveComments?: boolean;
}

// Stats for display
export interface ConversionStats {
    inputTokens: number;
    outputTokens: number;
    savings: number;
    savingsPercentage: number;
}

// Babel AST type helpers
import type { Node, Identifier, ObjectPattern, CallExpression, ArrayExpression } from '@babel/types';
import type { NodePath } from '@babel/traverse';

export type { Node, Identifier, ObjectPattern, CallExpression, ArrayExpression, NodePath };
