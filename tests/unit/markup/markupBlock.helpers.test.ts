import { describe, test, expect } from "vitest";

import {
    blockParser,
    handleHeading,
    handleParagraph,
} from "../../../src/markdown/markdownBlock.helpers";
import MarkdownNode from "../../../src/markdown/markdown.class";

describe("heading parser test", () => {
    test("simple heading parser test", () => {
        const content = "## Hello world";
        const markdownNode = handleHeading(content);
        expect(markdownNode).toEqual(
            new MarkdownNode("heading2", undefined, "Hello world"),
        );
    });
    test("simple heading parser test without space", () => {
        const content = "##Hello world";
        const markdownNode = handleHeading(content);
        expect(markdownNode).toEqual(
            new MarkdownNode("heading2", undefined, "Hello world"),
        );
    });
    test("simple heading parser test children", () => {
        const content = "### Hello *world*";
        const markdownNode = handleHeading(content);
        expect(markdownNode).toEqual(
            new MarkdownNode("heading3", [
                new MarkdownNode("text", undefined, "Hello "),
                new MarkdownNode("italic", undefined, "world"),
            ]),
        );
    });
});

describe("paragraph parser test", () => {
    test("simple Paragraph parser test", () => {
        const content = "Hello World";
        const markdownNode = handleParagraph(content);
        expect(markdownNode).toEqual(
            new MarkdownNode("paragraph", undefined, "Hello World"),
        );
    });
    test("complex paragraph test", () => {
        const content = `In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, *nor yet a dry*, bare, sandy hole with nothing in it to sit down on or to eat: it was a [hobbit-**hole**](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), and ![hobbit-hole1](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), that means comfort'.`;
        const markdownNode = handleParagraph(content);
        expect(markdownNode).toEqual(
            new MarkdownNode("paragraph", [
                new MarkdownNode(
                    "text",
                    undefined,
                    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, ",
                ),
                new MarkdownNode("italic", undefined, "nor yet a dry"),
                new MarkdownNode(
                    "text",
                    undefined,
                    ", bare, sandy hole with nothing in it to sit down on or to eat: it was a ",
                ),
                new MarkdownNode(
                    "link",
                    [
                        new MarkdownNode("text", undefined, "hobbit-"),
                        new MarkdownNode("bold", undefined, "hole"),
                    ],
                    undefined,
                    "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                    { title: "Hobbit lifestyles" },
                ),
                new MarkdownNode("text", undefined, ", and "),
                new MarkdownNode(
                    "image",
                    undefined,
                    "hobbit-hole1",
                    "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                    { title: "Hobbit lifestyles" },
                ),
                new MarkdownNode("text", undefined, ", that means comfort'."),
            ]),
        );
    });
});

// describe("block Parser tests",()=>{
//     test("sample test")
// })
