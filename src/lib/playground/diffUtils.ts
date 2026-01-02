import * as Diff from 'diff';
import type { DiffStats, MergeConflict, DiffOptions } from './types';

/**
 * Calculate detailed statistics from diff results
 */
export function calculateDiffStats(
    original: string,
    modified: string,
    options: DiffOptions
): DiffStats {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');

    let originalText = original;
    let modifiedText = modified;

    if (options.ignoreWhitespace) {
        originalText = original.replace(/\s+/g, ' ').trim();
        modifiedText = modified.replace(/\s+/g, ' ').trim();
    }

    if (!options.caseSensitive) {
        originalText = originalText.toLowerCase();
        modifiedText = modifiedText.toLowerCase();
    }

    const changes = Diff.diffLines(originalText, modifiedText);

    const added = changes
        .filter((c) => c.added)
        .reduce((sum, c) => sum + (c.count || 0), 0);
    const removed = changes
        .filter((c) => c.removed)
        .reduce((sum, c) => sum + (c.count || 0), 0);
    const unchanged = changes
        .filter((c) => !c.added && !c.removed)
        .reduce((sum, c) => sum + (c.count || 0), 0);

    const totalLines = Math.max(originalLines.length, modifiedLines.length);
    const similarity = totalLines > 0 ? (unchanged / totalLines) * 100 : 100;

    return {
        added,
        removed,
        unchanged,
        modified: Math.min(added, removed),
        totalLines,
        similarity: Math.round(similarity * 100) / 100,
    };
}

/**
 * Compute character-level diff for a line
 */
export function getCharacterDiff(original: string, modified: string) {
    return Diff.diffChars(original, modified);
}

/**
 * Compute word-level diff for a line
 */
export function getWordDiff(original: string, modified: string) {
    return Diff.diffWords(original, modified);
}

/**
 * Detect merge conflicts in text
 */
export function detectMergeConflicts(text: string): MergeConflict[] {
    const lines = text.split('\n');
    const conflicts: MergeConflict[] = [];
    let inConflict = false;
    let conflictStart = -1;
    let separator = -1;
    let currentOriginal: string[] = [];
    let currentModified: string[] = [];

    lines.forEach((line, index) => {
        if (line.startsWith('<<<<<<<')) {
            inConflict = true;
            conflictStart = index;
            currentOriginal = [];
            currentModified = [];
        } else if (line.startsWith('=======') && inConflict) {
            separator = index;
        } else if (line.startsWith('>>>>>>>') && inConflict) {
            conflicts.push({
                id: `conflict-${conflicts.length}`,
                startLine: conflictStart,
                endLine: index,
                original: currentOriginal.join('\n'),
                modified: currentModified.join('\n'),
            });
            inConflict = false;
        } else if (inConflict) {
            if (separator === -1) {
                currentOriginal.push(line);
            } else {
                currentModified.push(line);
            }
        }
    });

    return conflicts;
}

/**
 * Resolve a merge conflict
 */
export function resolveMergeConflict(
    text: string,
    conflict: MergeConflict
): string {
    const lines = text.split('\n');
    const before = lines.slice(0, conflict.startLine);
    const after = lines.slice(conflict.endLine + 1);

    let resolution = '';
    if (conflict.resolution === 'left') {
        resolution = conflict.original;
    } else if (conflict.resolution === 'right') {
        resolution = conflict.modified;
    } else if (conflict.resolution === 'both') {
        resolution = `${conflict.original}\n${conflict.modified}`;
    } else if (conflict.resolution === 'custom' && conflict.resolved) {
        resolution = conflict.resolved;
    }

    return [...before, resolution, ...after].join('\n');
}

/**
 * Generate unified diff format
 */
export function generateUnifiedDiff(
    original: string,
    modified: string,
    originalFileName = 'original',
    modifiedFileName = 'modified'
): string {
    const patch = Diff.createPatch(
        'file',
        original,
        modified,
        originalFileName,
        modifiedFileName
    );
    return patch;
}

/**
 * Generate patch format
 */
export function generatePatch(original: string, modified: string): string {
    return Diff.createTwoFilesPatch(
        'a/file',
        'b/file',
        original,
        modified,
        'Original',
        'Modified'
    );
}

/**
 * Export diff as HTML
 */
export function exportAsHTML(
    original: string,
    modified: string,
    options: DiffOptions
): string {
    const changes = Diff.diffLines(original, modified);

    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Diff Export</title>
    <style>
        body {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
            background: #1e1e1e;
            color: #d4d4d4;
        }
        .diff-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .diff-side {
            background: #252526;
            border-radius: 8px;
            padding: 16px;
        }
        .diff-line {
            padding: 2px 8px;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .added {
            background: rgba(34, 197, 94, 0.2);
            color: #86efac;
        }
        .removed {
            background: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
        }
        .unchanged {
            color: #9ca3af;
        }
        h2 {
            margin-top: 0;
            color: #60a5fa;
        }
    </style>
</head>
<body>
    <div class="diff-container">
        <div class="diff-side">
            <h2>Original</h2>
`;

    changes.forEach((change) => {
        const lines = change.value.split('\n').filter((line) => line);
        lines.forEach((line) => {
            if (change.removed) {
                html += `            <div class="diff-line removed">- ${escapeHtml(line)}</div>\n`;
            } else if (!change.added) {
                html += `            <div class="diff-line unchanged">  ${escapeHtml(line)}</div>\n`;
            }
        });
    });

    html += `
        </div>
        <div class="diff-side">
            <h2>Modified</h2>
`;

    changes.forEach((change) => {
        const lines = change.value.split('\n').filter((line) => line);
        lines.forEach((line) => {
            if (change.added) {
                html += `            <div class="diff-line added">+ ${escapeHtml(line)}</div>\n`;
            } else if (!change.removed) {
                html += `            <div class="diff-line unchanged">  ${escapeHtml(line)}</div>\n`;
            }
        });
    });

    html += `
        </div>
    </div>
</body>
</html>
`;

    return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Swap original and modified content
 */
export function swapContent(original: string, modified: string) {
    return { original: modified, modified: original };
}

/**
 * Find next difference position
 */
export function findNextDifference(
    changes: Diff.Change[],
    currentLine: number
): number {
    let lineCount = 0;
    for (let i = 0; i < changes.length; i++) {
        const change = changes[i];
        const lines = change.value.split('\n').filter((l) => l);
        const changeLines = lines.length;

        if ((change.added || change.removed) && lineCount > currentLine) {
            return lineCount;
        }

        lineCount += changeLines;
    }
    return -1;
}

/**
 * Find previous difference position
 */
export function findPreviousDifference(
    changes: Diff.Change[],
    currentLine: number
): number {
    let lineCount = 0;
    let lastDiffLine = -1;

    for (let i = 0; i < changes.length; i++) {
        const change = changes[i];
        const lines = change.value.split('\n').filter((l) => l);
        const changeLines = lines.length;

        if ((change.added || change.removed) && lineCount < currentLine) {
            lastDiffLine = lineCount;
        }

        if (lineCount >= currentLine) {
            return lastDiffLine;
        }

        lineCount += changeLines;
    }

    return lastDiffLine;
}
