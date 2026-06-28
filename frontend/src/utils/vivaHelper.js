/**
 * Normalize viva questions from various possible backend/API response formats
 * to a standardized array format: [{ id: Number, question: String }]
 * with sequential, duplicate-free, skip-free IDs.
 *
 * Support formats:
 * - Case 1: [{ id: Number, question: String }]
 * - Case 2: ["{\"id\":1,\"question\":\"...\"}"]
 * - Case 3: ["Question text..."]
 * - Case 4: { questions: [...] }
 *
 * @param {any} input
 * @returns {Array<{id: number, question: string}>}
 */
export function normalizeQuestions(input) {
    if (!input) return [];

    let rawList = [];

    // Case 4: wrapped in object { questions: [...] }
    if (input && typeof input === 'object' && !Array.isArray(input)) {
        if (Array.isArray(input.questions)) {
            rawList = input.questions;
        } else if (input.questions && typeof input.questions === 'object') {
            rawList = Object.values(input.questions);
        } else {
            // General object keys extraction if not standard questions key
            rawList = Object.values(input).filter(val => Array.isArray(val))[0] || [];
        }
    } else if (Array.isArray(input)) {
        rawList = input;
    }

    // Type Safety / Validation warning
    if (!Array.isArray(rawList)) {
        console.error("Type Safety Violation: Expected array for viva questions but got:", rawList);
        return [];
    }

    const normalized = [];

    rawList.forEach((item, index) => {
        if (!item) return;

        let parsedItem = item;

        // Handle string representation
        if (typeof item === 'string') {
            const trimmed = item.trim();
            // Handle Case 2 (Stringified JSON objects)
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                try {
                    parsedItem = JSON.parse(trimmed);
                } catch (e) {
                    // Fallback to parse single quotes (like python string representation)
                    try {
                        const sanitized = trimmed
                            .replace(/'/g, '"')
                            .replace(/True/g, 'true')
                            .replace(/False/g, 'false')
                            .replace(/None/g, 'null');
                        parsedItem = JSON.parse(sanitized);
                    } catch (err) {
                        parsedItem = item;
                    }
                }
            }
        }

        let qText = '';
        let qId = index + 1;

        if (parsedItem && typeof parsedItem === 'object') {
            // Case 1 (Correctly parsed or defined object)
            qText = parsedItem.question || parsedItem.text || '';
            if (parsedItem.id !== undefined && !isNaN(Number(parsedItem.id))) {
                qId = Number(parsedItem.id);
            }
        } else {
            // Case 3 (Direct plain string)
            qText = String(parsedItem);
        }

        if (qText && typeof qText === 'string') {
            normalized.push({
                id: qId,
                question: qText.trim()
            });
        }
    });

    // Sequence Fix: Numbering must always be 1, 2, 3, 4, 5... (sequential, no skips, no duplicates)
    return normalized.map((item, idx) => ({
        id: idx + 1,
        question: item.question
    }));
}
