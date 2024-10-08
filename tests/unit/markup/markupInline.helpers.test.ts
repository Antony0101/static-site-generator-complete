import { describe, test, expect } from "vitest";

import {
    matchAllGenerator,
    parseLinks,
    parseImages,
    parseNodesDelimiter,
    inlineParser,
} from "../../../src/markdown/markdownInline.helpers";
import MarkdownNode from "../../../src/markdown/markdown.class";

describe("matchAllGenerator for regex matching", () => {
    test("testing normal regex cases", () => {
        const str = "hello world, hello car";
        const regex = /hel/;
        const gen = matchAllGenerator(str, regex);
        const result: any = [];
        for (const val of gen) {
            result.push(val);
        }
        expect(result[0][0]).toEqual("hel");
    });
    test("testing global case", () => {
        const str = "hello helloe heello";
        const regex = /hel/g;
        const gen = matchAllGenerator(str, regex);
        expect(() => gen.next()).toThrowError(
            "Regex contains global flag, won't work with regex with global flag",
        );
    });
    test("testing with complex regex", () => {
        const str = `In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a [hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), and [hobbit-hole1](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), that means comfort'.`;
        const regex = /\[(.*?)\]\((.*?)\)/;
        const gen = matchAllGenerator(str, regex);
        const value1 = gen.next().value;
        const result1: any = [
            `[hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle \"Hobbit lifestyles\")`,
            `hobbit-hole`,
            `https://en.wikipedia.org/wiki/Hobbit#Lifestyle \"Hobbit lifestyles\"`,
        ];
        result1.index = 211;
        result1.input = str;
        result1.group = undefined;
        expect(value1).toEqual(result1);
        const value2 = gen.next().value;
        const result2: any = [
            `[hobbit-hole1](https://en.wikipedia.org/wiki/Hobbit#Lifestyle \"Hobbit lifestyles\")`,
            `hobbit-hole1`,
            `https://en.wikipedia.org/wiki/Hobbit#Lifestyle \"Hobbit lifestyles\"`,
        ];
        result2.index = 6;
        result2.input = `, and [hobbit-hole1](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), that means comfort'.`;
        result2.group = undefined;
        expect(value2).toEqual(result2);
        expect(gen.next()).toEqual({ value: undefined, done: true });
    });
});

describe("test for parseLink function", () => {
    test("simple parseLink test", () => {
        const content =
            '[hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles")';
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([
            new MarkdownNode(
                "link",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: "Hobbit lifestyles" },
            ),
        ]);
    });
    test("without link", () => {
        const content = "hello world";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([new MarkdownNode("text", undefined, content)]);
    });
    test("without title", () => {
        const content =
            "[hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle)";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([
            new MarkdownNode(
                "link",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: undefined },
            ),
        ]);
    });
    test("check with image", () => {
        const content =
            "![hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle)";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([
            new MarkdownNode(
                "text",
                undefined,
                "![hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle)",
            ),
        ]);
    });
    test("with text before and after", () => {
        const content =
            "hello [hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle) sam";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([
            new MarkdownNode("text", undefined, "hello "),
            new MarkdownNode(
                "link",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: undefined },
            ),
            new MarkdownNode("text", undefined, " sam"),
        ]);
    });
    test("complex content", () => {
        const content = `In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a [hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), and [hobbit-hole1](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), that means comfort'.`;
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([
            new MarkdownNode(
                "text",
                undefined,
                "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a ",
            ),
            new MarkdownNode(
                "link",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: "Hobbit lifestyles" },
            ),
            new MarkdownNode("text", undefined, ", and "),
            new MarkdownNode(
                "link",
                undefined,
                "hobbit-hole1",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: "Hobbit lifestyles" },
            ),
            new MarkdownNode("text", undefined, ", that means comfort'."),
        ]);
    });
});

describe("test for parseImage function", () => {
    test("simple parseImage test", () => {
        const content =
            '![hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles")';
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseImages(nodes);
        expect(result).toEqual([
            new MarkdownNode(
                "image",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: "Hobbit lifestyles" },
            ),
        ]);
    });
    test("withoout image", () => {
        const content = "hello world";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseImages(nodes);
        expect(result).toEqual([new MarkdownNode("text", undefined, content)]);
    });
    test("without title", () => {
        const content =
            "![hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle)";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseImages(nodes);
        expect(result).toEqual([
            new MarkdownNode(
                "image",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: undefined },
            ),
        ]);
    });
    test("with text before and after", () => {
        const content =
            "hello ![hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle) sam";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseImages(nodes);
        expect(result).toEqual([
            new MarkdownNode("text", undefined, "hello "),
            new MarkdownNode(
                "image",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: undefined },
            ),
            new MarkdownNode("text", undefined, " sam"),
        ]);
    });
    // currently image within links are not supported as this relationship is very hard to capture with  regex.
    // test("with image in link", () => {
    //     const content = `hello [![An old rock in the desert](/assets/images/shiprock.jpg "Shiprock, New Mexico by Beau Rogers")](https://www.flickr.com/photos/beaurogers/31833779864/in/photolist) sam`;
    //     const nodes = [new MarkdownNode("text", undefined, content)];
    //     const startNodes = parseLinks(nodes);
    //     const result = parseImages(startNodes);
    //     expect(result).toEqual([
    //         new MarkdownNode("text", undefined, "hello "),
    //         new MarkdownNode(
    //             "image",
    //             undefined,
    //             "hobbit-hole",
    //             "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
    //             { title: undefined },
    //         ),
    //         new MarkdownNode("text", undefined, " sam"),
    //     ]);
    // });
});

describe("tests for delimiter parser", () => {
    test("simple delimiter", () => {
        const content = "hello hello **hello** world world";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseNodesDelimiter(nodes, "**", "bold");
        expect(result).toEqual([
            new MarkdownNode("text", undefined, "hello hello "),
            new MarkdownNode("bold", undefined, "hello"),
            new MarkdownNode("text", undefined, " world world"),
        ]);
    });
    test("simple delimiter 2", () => {
        const content = "hello hello **hello**";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseNodesDelimiter(nodes, "**", "bold");
        expect(result).toEqual([
            new MarkdownNode("text", undefined, "hello hello "),
            new MarkdownNode("bold", undefined, "hello"),
        ]);
    });
    test("content without delimiter", () => {
        const content = "hello hello world world";
        const nodes = [new MarkdownNode("text", undefined, content)];
        const result = parseNodesDelimiter(nodes, "**", "bold");
        expect(result).toEqual([
            new MarkdownNode("text", undefined, "hello hello world world"),
        ]);
    });
    test("delimiter error when closing symbol is not found", () => {
        const content = "hello world *hello world";
        const nodes = [new MarkdownNode("text", undefined, content)];
        expect(() => parseNodesDelimiter(nodes, "*", "bold")).toThrow(
            "Closing delimiter * not found",
        );
    });
    test("delimiter with multiple parts", () => {
        const content =
            "hello hello **world in the world *world world* in the , hello * care* world world,**hello symbol";
        const nodes = [new MarkdownNode("text", undefined, content)];
        let result = parseNodesDelimiter(nodes, "**", "bold");
        result = parseNodesDelimiter(result, "*", "italic");
        expect(result).toEqual([
            new MarkdownNode("text", undefined, "hello hello "),
            new MarkdownNode("bold", [
                new MarkdownNode("text", undefined, "world in the world "),
                new MarkdownNode("italic", undefined, "world world"),
                new MarkdownNode("text", undefined, " in the , hello "),
                new MarkdownNode("italic", undefined, " care"),
                new MarkdownNode("text", undefined, " world world,"),
            ]),
            new MarkdownNode("text", undefined, "hello symbol"),
        ]);
    });
});

describe("tests for inline parser", () => {
    test("simple test", () => {
        const content =
            "An elaborate pantheon of deities (the `Valar` and `Maiar`)";
        const result = inlineParser(content);
        expect(result).toEqual([
            new MarkdownNode(
                "text",
                undefined,
                "An elaborate pantheon of deities (the ",
            ),
            new MarkdownNode("code", undefined, "Valar"),
            new MarkdownNode("text", undefined, " and "),
            new MarkdownNode("code", undefined, "Maiar"),
            new MarkdownNode("text", undefined, ")"),
        ]);
    });
});
