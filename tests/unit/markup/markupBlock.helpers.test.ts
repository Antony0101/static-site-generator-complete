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
        const content = "## Hello *world*";
        const markupNode = handleHeading(content);
        expect(markupNode).toEqual(
            new MarkupNode("heading2", [
                new MarkupNode("text", undefined, "Hello "),
                new MarkupNode("italic", undefined, "world"),
            ]),
        );
    });
});

// describe("block Parser tests",()=>{
//     test("sample test")
// })
