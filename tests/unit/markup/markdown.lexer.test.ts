import { describe, test, expect } from "vitest";

import { primitiveMarkdownLexer } from "../../../src/markdown/markdown.lexer";

describe("primitiveMarkdownLexer tests", () => {
    test("simple text", () => {
        const markdown = "hello *world* !2";
        const lexerNodes = primitiveMarkdownLexer(markdown);
        expect(lexerNodes).toEqual([
            { type: "text", content: "hello ", contentLength: 6 },
            { type: "*", content: "*", contentLength: 1 },
            { type: "text", content: "world", contentLength: 5 },
            { type: "*", content: "*", contentLength: 1 },
            { type: "text", content: " ", contentLength: 1 },
            { type: "!", content: "!", contentLength: 1 },
            { type: "num", content: "2", contentLength: 1 },
        ]);
    });
    test("text with more special characters", () => {
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
            { type: "num", content: "2", contentLength: 1 },
        ]);
    });
    test("escaped characters", () => {
        const markdown = "hello \\*world\\* !2";
        const lexerNodes = primitiveMarkdownLexer(markdown);
        expect(lexerNodes).toEqual([
            { type: "text", content: "hello *world* ", contentLength: 14 },
            { type: "!", content: "!", contentLength: 1 },
            { type: "num", content: "2", contentLength: 1 },
        ]);
    });
    test("content with numbers", () => {
        const markdown = "hello 1234!2 avc12dg3fg3\\*5av\\*ad2";
        const lexerNodes = primitiveMarkdownLexer(markdown);
        expect(lexerNodes).toEqual([
            { type: "text", content: "hello ", contentLength: 6 },
            { type: "num", content: "1234", contentLength: 4 },
            { type: "!", content: "!", contentLength: 1 },
            { type: "num", content: "2", contentLength: 1 },
            { type: "text", content: " avc", contentLength: 4 },
            { type: "num", content: "12", contentLength: 2 },
            { type: "text", content: "dg", contentLength: 2 },
            { type: "num", content: "3", contentLength: 1 },
            { type: "text", content: "fg", contentLength: 2 },
            { type: "num", content: "3", contentLength: 1 },
            { type: "text", content: "*", contentLength: 1 },
            { type: "num", content: "5", contentLength: 1 },
            { type: "text", content: "av*ad", contentLength: 5 },
            { type: "num", content: "2", contentLength: 1 },
        ]);
    });
});
