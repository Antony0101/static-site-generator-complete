import { htmlObjectToString } from "./html/html.functions.js";
import {
    markupToHtml,
    markupStringToObject,
} from "./markup/markup.functions.js";

function converter(markupString: string): string {
    const markupTree = markupStringToObject(markupString);
    const htmlTree = markupToHtml(markupTree);
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
