import { describe, test, expect } from "vitest";
import HtmlNode from "../../../src/html/html.class";
import { htmlObjectToString } from "../../../src/html/html.functions";

describe("convert html Tree to string", () => {
    test("simple html tree", () => {
        const htmlTree = new HtmlNode(
            "h1",
            { class: "text-xl red-500" },
            "Hello World",
        );
        const htmlString = htmlObjectToString(htmlTree);
        expect(htmlString).toEqual(
            `<h1 class="text-xl red-500">Hello World</h1>`,
        );
    });
});
