import type { Tool } from './types';

export const PLAYGROUND_TOOLS: Tool[] = [
    {
        id: 'code-editor',
        name: 'Live Code Editor',
        description: 'Write HTML, CSS, and JavaScript with live preview. Like CodePen in your browser.',
        icon: 'Code2',
        path: '/playground/code-editor',
    },
    {
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Test regular expressions with real-time match highlighting and validation.',
        icon: 'Search',
        path: '/playground/regex-tester',
    },
    {
        id: 'diff-checker',
        name: 'Diff Checker',
        description: 'Compare two text blocks and see the differences highlighted line by line.',
        icon: 'GitCompare',
        path: '/playground/diff-checker',
    },
    {
        id: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Validate, beautify, and minify JSON with syntax highlighting.',
        icon: 'Braces',
        path: '/playground/json-formatter',
    },
    {
        id: 'css-playground',
        name: 'CSS Playground',
        description: 'Experiment with CSS properties using visual sliders and see the generated code.',
        icon: 'Palette',
        path: '/playground/css-playground',
    },
];
