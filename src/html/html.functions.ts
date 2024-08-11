import HtmlNode from "./html.class.js";

function htmlObjectToString(htmlTree: HtmlNode) {
    const htmlString = htmlTree.to_html();
    return htmlString;
}

export { htmlObjectToString };
