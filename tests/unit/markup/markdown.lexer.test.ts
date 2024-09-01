import { describe, test, expect } from "vitest";

import { primitiveMarkdownLexer } from "../../../src/markdown/markdown.lexer";

describe("primitiveMarkdownLexer tests", () => {
    test("simple markdown", () => {
        const markdown = "hello *world* !2";
        const lexerNodes = primitiveMarkdownLexer(markdown);
        expect(lexerNodes).toEqual([
            { type: "text", content: "hello ", contentLength: 6 },
            { type: "*", content: "*", contentLength: 1 },
            { type: "text", content: "world", contentLength: 5 },
            { type: "*", content: "*", contentLength: 1 },
            { type: "text", content: " ", contentLength: 1 },
            { type: "!", content: "!", contentLength: 1 },
            { type: "text", content: "2", contentLength: 1 },
        ]);
    });
    test("markdown with more special characters", () => {
        const markdown = "hello ***world*!! [] !2";
        const lexerNodes = primitiveMarkdownLexer(markdown);
        expect(lexerNodes).toEqual([
            { type: "text", content: "hello ", contentLength: 6 },
            { type: "*", content: "***", contentLength: 3 },
            { type: "text", content: "world", contentLength: 5 },
            { type: "*", content: "*", contentLength: 1 },
            { type: "!", content: "!!", contentLength: 2 },
            { type: "text", content: " ", contentLength: 1 },
            { type: "[", content: "[", contentLength: 1 },
            { type: "]", content: "]", contentLength: 1 },
            { type: "text", content: " ", contentLength: 1 },
            { type: "!", content: "!", contentLength: 1 },
            { type: "text", content: "2", contentLength: 1 },
        ]);
    });
    test("escaped characters", () => {
        const markdown = "hello \\*world\\* !2";
        const lexerNodes = primitiveMarkdownLexer(markdown);
        expect(lexerNodes).toEqual([
            { type: "text", content: "hello *world* ", contentLength: 14 },
            { type: "!", content: "!", contentLength: 1 },
            { type: "text", content: "2", contentLength: 1 },
        ]);
    });
});
