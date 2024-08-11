import { describe, test, expect } from "vitest";

import {
    blockParser,
    handleHeading,
    handleParagraph,
} from "../../../src/markup/markupBlock.helpers";
import MarkupNode from "../../../src/markup/markup.class";

describe("heading parser test", () => {
    test("simple heading parser test", () => {
        const content = "## Hello world";
        const markupNode = handleHeading(content);
        expect(markupNode).toEqual(
            new MarkupNode("heading2", undefined, "Hello world"),
        );
    });
    test("simple heading parser test without space", () => {
        const content = "##Hello world";
        const markupNode = handleHeading(content);
        expect(markupNode).toEqual(
            new MarkupNode("heading2", undefined, "Hello world"),
        );
    });
    test("simple heading parser test children", () => {
        const content = "### Hello *world*";
        const markupNode = handleHeading(content);
        expect(markupNode).toEqual(
            new MarkupNode("heading3", [
                new MarkupNode("text", undefined, "Hello "),
                new MarkupNode("italic", undefined, "world"),
            ]),
        );
    });
});

describe("paragraph parser test", () => {
    test("simple Paragraph parser test", () => {
        const content = "Hello World";
        const markupNode = handleParagraph(content);
        expect(markupNode).toEqual(
            new MarkupNode("paragraph", undefined, "Hello World"),
        );
    });
    test("complex paragraph test", () => {
        const content = `In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, *nor yet a dry*, bare, sandy hole with nothing in it to sit down on or to eat: it was a [hobbit-**hole**](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), and ![hobbit-hole1](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), that means comfort'.`;
        const markupNode = handleParagraph(content);
        expect(markupNode).toEqual(
            new MarkupNode("paragraph", [
                new MarkupNode(
                    "text",
                    undefined,
                    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, ",
                ),
                new MarkupNode("italic", undefined, "nor yet a dry"),
                new MarkupNode(
                    "text",
                    undefined,
                    ", bare, sandy hole with nothing in it to sit down on or to eat: it was a ",
                ),
                new MarkupNode(
                    "link",
                    [
                        new MarkupNode("text", undefined, "hobbit-"),
                        new MarkupNode("bold", undefined, "hole"),
                    ],
                    undefined,
                    "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                    { title: "Hobbit lifestyles" },
                ),
                new MarkupNode("text", undefined, ", and "),
                new MarkupNode(
                    "image",
                    undefined,
                    "hobbit-hole1",
                    "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                    { title: "Hobbit lifestyles" },
                ),
                new MarkupNode("text", undefined, ", that means comfort'."),
            ]),
        );
    });
});

// describe("block Parser tests",()=>{
//     test("sample test")
// })
