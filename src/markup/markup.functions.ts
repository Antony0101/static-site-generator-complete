import HtmlNode from "../html/html.class";
import MarkupNode from "./markup.class";

function markupToHtml(markupTree: MarkupNode[]) {
    const htmlTree = new HtmlNode("div", {}, undefined, []);
    function toHtml(markup: MarkupNode) {
        let htmlNode: HtmlNode = new HtmlNode(null, {}, undefined);
        if (markup.children) {
            htmlNode.children = markup.children.map((child) => toHtml(child));
        } else {
            htmlNode.value = markup.content;
        }
        switch (markup.element) {
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
                htmlNode.props["href"] = markup.link || "";
                break;
            case "image":
                htmlNode.tag = "img";
                htmlNode.props["src"] = markup.link || "";
                break;
        }
        return htmlNode;
    }
    htmlTree.children = markupTree.map((markup) => toHtml(markup));
    return htmlTree;
}

function markupStringToObject(markupString: string): MarkupNode[] {
    const partialBlocks = markupString.split("\n\n");
    const markupNodes: MarkupNode[] = [];
    for (const partialBlock of partialBlocks) {
    }
    return markupNodes;
}

export { markupToHtml, markupStringToObject };
