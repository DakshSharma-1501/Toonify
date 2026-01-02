// Playground tool types

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: string;
    path: string;
}

// Live Code Editor
export interface CodeEditorState {
    html: string;
    css: string;
    javascript: string;
}

// Regex Tester
export interface RegexTesterState {
    pattern: string;
    flags: {
        g: boolean;
        i: boolean;
        m: boolean;
        s: boolean;
        u: boolean;
        y: boolean;
    };
    testString: string;
}

export interface RegexMatch {
    value: string;
    index: number;
    length: number;
}

// Diff Checker
export interface DiffCheckerState {
    original: string;
    modified: string;
}

export type DiffType = 'added' | 'removed' | 'unchanged';

export interface DiffResult {
    type: DiffType;
    value: string;
    count?: number;
}

// JSON Formatter
export interface JSONFormatterState {
    input: string;
    indent: number;
}

export interface JSONFormatterResult {
    success: boolean;
    formatted: string | null;
    error: string | null;
}

// CSS Playground
export interface CSSPlaygroundState {
    padding: number;
    margin: number;
    borderRadius: number;
    boxShadow: {
        x: number;
        y: number;
        blur: number;
        spread: number;
        color: string;
    };
    backgroundColor: string;
    textColor: string;
    width: number;
    height: number;
}
