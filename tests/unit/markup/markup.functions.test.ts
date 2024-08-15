import { describe, test, expect } from "vitest";
import {
    markdownStringToObject,
    markdownToHtml,
} from "../../../src/markdown/markdown.functions";
import MarkdownNode from "../../../src/markdown/markdown.class";
import HtmlNode from "../../../src/html/html.class";

describe("markdownToHtml tests", () => {
    test("simple markdown", () => {
        const markdownHeading = new MarkdownNode(
            "heading2",
            undefined,
            "hello",
        );
        const markdownBody = new MarkdownNode("paragraph", [
            new MarkdownNode("text", undefined, "hello "),
            new MarkdownNode("bold", undefined, "world"),
            new MarkdownNode("text", undefined, " !2"),
        ]);
        const markdown = [markdownHeading, markdownBody];
        const htmlTree = markdownToHtml(markdown);
        expect(htmlTree).toEqual(
            new HtmlNode("div", {}, undefined, [
                new HtmlNode("h2", {}, "hello"),
                new HtmlNode("p", {}, undefined, [
                    new HtmlNode("span", {}, "hello "),
                    new HtmlNode("strong", {}, "world"),
                    new HtmlNode("span", {}, " !2"),
                ]),
            ]),
        );
    });
});
