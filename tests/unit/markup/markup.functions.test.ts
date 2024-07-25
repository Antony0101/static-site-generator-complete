import { describe, test, expect } from "vitest";
import {
    markupStringToObject,
    markupToHtml,
} from "../../../src/markup/markup.functions";
import MarkupNode from "../../../src/markup/markup.class";
import HtmlNode from "../../../src/html/html.class";

describe("markupToHtml tests", () => {
    test("simple markup", () => {
        const markupHeading = new MarkupNode("heading2", undefined, "hello");
        const markupBody = new MarkupNode("paragraph", [
            new MarkupNode("text", undefined, "hello "),
            new MarkupNode("bold", undefined, "world"),
            new MarkupNode("text", undefined, " !2"),
        ]);
        const markup = [markupHeading, markupBody];
        const htmlTree = markupToHtml(markup);
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
