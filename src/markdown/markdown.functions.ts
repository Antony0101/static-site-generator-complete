import HtmlNode from "../html/html.class.js";
import MarkdownNode from "./markdown.class.js";
import { blockParser } from "./markdownBlock.helpers.js";

function markdownToHtml(markdownTree: MarkdownNode[]) {
    const htmlTree = new HtmlNode("div", {}, undefined, []);
    function toHtml(markdown: MarkdownNode) {
        let htmlNode: HtmlNode = new HtmlNode(null, {}, undefined);
        if (markdown.children) {
            htmlNode.children = markdown.children.map((child) => toHtml(child));
        } else {
            htmlNode.value = markdown.content;
        }
        switch (markdown.element) {
            case "heading1":
                htmlNode.tag = "h1";
                break;
            case "heading2":
                htmlNode.tag = "h2";
                break;
            case "heading3":
                htmlNode.tag = "h3";
                break;
            case "heading4":
                htmlNode.tag = "h4";
                break;
            case "heading5":
                htmlNode.tag = "h5";
                break;
            case "heading6":
                htmlNode.tag = "h6";
                break;
            case "paragraph":
                htmlNode.tag = "p";
                break;
            case "blockQuote":
                htmlNode.tag = "blockquote";
                break;
            case "codeBlock":
                htmlNode.tag = "pre";
                break;
            case "orderedList":
                htmlNode.tag = "ol";
                break;
            case "unorderedList":
                htmlNode.tag = "ul";
                break;
            case "listElement":
                htmlNode.tag = "li";
            case "lineBreak":
                htmlNode.tag = "br";
                break;
            case "text":
                htmlNode.tag = "span";
                break;
            case "bold":
                htmlNode.tag = "strong";
                break;
            case "italic":
                htmlNode.tag = "em";
                break;
            case "code":
                htmlNode.tag = "code";
                break;
            case "link":
                htmlNode.tag = "a";
                htmlNode.props["href"] = markdown.link || "";
                break;
            case "image":
                htmlNode.tag = "img";
                htmlNode.props["src"] = markdown.link || "";
                break;
        }
        return htmlNode;
    }
    htmlTree.children = markdownTree.map((markdown) => toHtml(markdown));
    return htmlTree;
}

function markdownStringToObject(markdownString: string): MarkdownNode[] {
    const partialBlocks = markdownString.split("\n\n");
    const markdownNodes: MarkdownNode[] = [];
    for (const partialBlock of partialBlocks) {
        markdownNodes.push(blockParser(partialBlock));
    }
    return markdownNodes;
}

export { markdownToHtml, markdownStringToObject };
