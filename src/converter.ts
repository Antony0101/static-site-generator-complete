import { htmlObjectToString } from "./html/html.functions.js";
import {
    markdownToHtml,
    markdownStringToObject,
} from "./markdown/markdown.functions.js";

function converter(markdownString: string): string {
    const markdownTree = markdownStringToObject(markdownString);
    const htmlTree = markdownToHtml(markdownTree);
    const htmlString = htmlObjectToString(htmlTree);
    return htmlString;
}

function formatedHtmlCreator(title: string, content: string) {
    const convertedContent = converter(content);
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="description" content="sample description" />
        <title>${title}</title>
        <link rel="stylesheet" crossorigin href="/assets/index-BvEl8Eta.css">
    </head>
    <body>
        ${convertedContent}
    </body>
    </html>`;
    return htmlContent;
}

export default formatedHtmlCreator;
