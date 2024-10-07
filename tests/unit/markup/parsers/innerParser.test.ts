import { describe, test, expect } from "vitest";
import { innerParser } from "../../../../src/markdown/parsers/innerParser";
import { primitiveMarkdownLexer } from "../../../../src/markdown/markdown.lexer";
import e from "express";
import MarkdownNode from "../../../../src/markdown/markdown.class";

describe("bold, italic and code", () => {
    test("test bold", () => {
        const input = "test hello **world** and **bold or bold**";
        const lexerNodes = primitiveMarkdownLexer(input);
        const curIndex = 0;
        const context = [];
        const { ast, nextNodeIndex } = innerParser(
            lexerNodes,
            curIndex,
            context,
        );
        expect(ast).toEqual([
            new MarkdownNode("text", "test hello "),
            new MarkdownNode("textBolded", "world"),
            new MarkdownNode("text", " and "),
            new MarkdownNode("textBolded", "bold or bold"),
        ]);
    });

    test("test bold", () => {
        const input =
            "test hello **world** and **bold or bold*** gekk `sample code`";
        const lexerNodes = primitiveMarkdownLexer(input);
        const curIndex = 0;
        const context = [];
        const { ast, nextNodeIndex } = innerParser(
            lexerNodes,
            curIndex,
            context,
        );
        expect(ast).toEqual([
            new MarkdownNode("text", "test hello "),
            new MarkdownNode("textBolded", "world"),
            new MarkdownNode("text", " and **bold or bold*** gekk "),
            new MarkdownNode("codeInline", "sample code"),
        ]);
    });

    test("test bold italic children", () => {
        const input = "test hello **world _and_ bold** and **bold or bold***";
        const lexerNodes = primitiveMarkdownLexer(input);
        const curIndex = 0;
        const context = [];
        const { ast, nextNodeIndex } = innerParser(
            lexerNodes,
            curIndex,
            context,
        );
        expect(ast).toEqual([
            new MarkdownNode("text", "test hello "),
            new MarkdownNode("textBolded", [
                new MarkdownNode("text", "world "),
                new MarkdownNode("textEmphasized", "and"),
                new MarkdownNode("text", " bold"),
            ]),
            new MarkdownNode("text", " and **bold or bold***"),
        ]);
    });

    test("test image and link", () => {
        const input =
            'test hello [world](https://world.com) and [bold or bold](https://bold.com) and image ![image](https://image.com "title here")';
        const lexerNodes = primitiveMarkdownLexer(input);
        const curIndex = 0;
        const context = [];
        const { ast, nextNodeIndex } = innerParser(
            lexerNodes,
            curIndex,
            context,
        );
        expect(ast).toEqual([
            new MarkdownNode("text", "test hello "),
            new MarkdownNode("link", "world", {
                link: "https://world.com",
                title: "",
            }),
            new MarkdownNode("text", " and "),
            new MarkdownNode("link", "bold or bold", {
                link: "https://bold.com",
                title: "",
            }),
            new MarkdownNode("text", " and image "),
            new MarkdownNode("image", "image", {
                link: "https://image.com",
                title: "title here",
            }),
        ]);
    });
    test("test image within link", () => {
        const input =
            'test hello [![image](https://image.com "title here")](https://world.com "link here")';
        const lexerNodes = primitiveMarkdownLexer(input);
        const curIndex = 0;
        const context = [];
        const { ast, nextNodeIndex } = innerParser(
            lexerNodes,
            curIndex,
            context,
        );
        expect(ast).toEqual([
            new MarkdownNode("text", "test hello "),
            new MarkdownNode(
                "link",
                [
                    new MarkdownNode("image", "image", {
                        link: "https://image.com",
                        title: "title here",
                    }),
                ],
                {
                    link: "https://world.com",
                    title: "link here",
                },
            ),
        ]);
    });
});
