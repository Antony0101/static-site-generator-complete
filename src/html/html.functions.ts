import HtmlNode from "./html.class";

function htmlObjectToString(htmlTree: HtmlNode) {
    const htmlString = htmlTree.to_html();
    return htmlString;
}

export { htmlObjectToString };
