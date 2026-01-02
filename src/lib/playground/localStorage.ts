/**
 * Type-safe localStorage utilities for playground tools
 */

export const saveToStorage = <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return defaultValue;
    }
};

export const removeFromStorage = (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Failed to remove from localStorage:', error);
    }
};

// Storage keys for each tool
export const STORAGE_KEYS = {
    CODE_EDITOR: 'playground_code_editor',
    REGEX_TESTER: 'playground_regex_tester',
    DIFF_CHECKER: 'playground_diff_checker',
    JSON_FORMATTER: 'playground_json_formatter',
    CSS_PLAYGROUND: 'playground_css_playground',
} as const;
