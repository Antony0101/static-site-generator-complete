import { describe, test, expect } from "vitest";

import {
    matchAllGenerator,
    parseLinks,
} from "../../../src/markup/markupInline.helpers";
import MarkupNode from "../../../src/markup/markup.class";

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
        const nodes = [new MarkupNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([
            new MarkupNode(
                "link",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: "Hobbit lifestyles" },
            ),
        ]);
    });
    test("without title", () => {
        const content =
            "[hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle)";
        const nodes = [new MarkupNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([
            new MarkupNode(
                "link",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: undefined },
            ),
        ]);
    });
    test("with text before and after", () => {
        const content =
            "hello [hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle) sam";
        const nodes = [new MarkupNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([
            new MarkupNode("text", undefined, "hello "),
            new MarkupNode(
                "link",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: undefined },
            ),
            new MarkupNode("text", undefined, " sam"),
        ]);
    });
    test("complex content", () => {
        const content = `In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a [hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), and [hobbit-hole1](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), that means comfort'.`;
        const nodes = [new MarkupNode("text", undefined, content)];
        const result = parseLinks(nodes);
        expect(result).toEqual([
            new MarkupNode(
                "text",
                undefined,
                "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a ",
            ),
            new MarkupNode(
                "link",
                undefined,
                "hobbit-hole",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: "Hobbit lifestyles" },
            ),
            new MarkupNode("text", undefined, ", and "),
            new MarkupNode(
                "link",
                undefined,
                "hobbit-hole1",
                "https://en.wikipedia.org/wiki/Hobbit#Lifestyle",
                { title: "Hobbit lifestyles" },
            ),
            new MarkupNode("text", undefined, ", that means comfort'."),
        ]);
    });
});
