import { describe, test, expect } from "vitest";

import HtmlNode from "../../../src/html/html.class";

describe("check html class object", () => {
    test("html basic object test with value", () => {
        const html = new HtmlNode("h1", {}, "ddadffd");
        expect(html.tag).toEqual("h1");
        expect(html.props).toEqual({});
        expect(html.value).toEqual("ddadffd");
        expect(html.children).toEqual(undefined);
    });
    test("html basic object with children", () => {
        const html = new HtmlNode("div", { class: "hello" }, undefined, [
            new HtmlNode("h1", {}, "hello"),
            new HtmlNode("p", {}, "hello world"),
        ]);
        expect(html.tag).toEqual("div");
        expect(html.props).toEqual({ class: "hello" });
        expect(html.value).toEqual(undefined);
        expect(html.children?.length).toEqual(2);
        const children = html.children || [];
        expect(children[0].tag).toEqual("h1");
        expect(children[0].props).toEqual({});
        expect(children[0].value).toEqual("hello");
        expect(children[0].children).toEqual(undefined);
        expect(children[1].tag).toEqual("p");
        expect(children[1].props).toEqual({});
        expect(children[1].value).toEqual("hello world");
        expect(children[1].children).toEqual(undefined);
    });
});

describe("check html class convert props to html", () => {
    test("basic html props", () => {
        const html = new HtmlNode("img", {
            src: "./hello.jpg",
            height: "30px",
            width: "30px",
        });
        expect(html.tag).toEqual("img");
        expect(html.props).toEqual({
            src: "./hello.jpg",
            height: "30px",
            width: "30px",
        });
        const propString = html.props_to_html();
        expect(propString).toEqual(
            `src="./hello.jpg" height="30px" width="30px"`,
        );
    });
});

describe("check html class convert to html", () => {
    test("basic html object", () => {
        const html = new HtmlNode("img", {
            src: "./hello.jpg",
            height: "30px",
            width: "30px",
        });
        expect(html.tag).toEqual("img");
        expect(html.props).toEqual({
            src: "./hello.jpg",
            height: "30px",
            width: "30px",
        });
        const htmlString = html.to_html();
        expect(htmlString).toEqual(
            `<img src="./hello.jpg" height="30px" width="30px"/>`,
        );
    });
    test("basic html with value", () => {
        const html = new HtmlNode(
            "h1",
            {
                class: "text-lg hover",
            },
            "hello world",
        );
        expect(html.tag).toEqual("h1");
        expect(html.props).toEqual({
            class: "text-lg hover",
        });
        expect(html.value).toEqual("hello world");
        const htmlString = html.to_html();
        expect(htmlString).toEqual(
            `<h1 class="text-lg hover">hello world</h1>`,
        );
    });
    test("html basic object with children", () => {
        const html = new HtmlNode(
            "div",
            { class: "hello", src: "./hello" },
            undefined,
            [
                new HtmlNode("h1", { class: "text-xl" }, "hello"),
                new HtmlNode("p", {}, "hello world"),
                new HtmlNode("img", {
                    src: "./hello.jpg",
                    height: "30px",
                    width: "30px",
                }),
            ],
        );
        const htmlString = html.to_html();
        expect(htmlString).toEqual(
            `<div class="hello" src="./hello"><h1 class="text-xl">hello</h1><p>hello world</p><img src="./hello.jpg" height="30px" width="30px"/></div>`,
        );
    });
});
