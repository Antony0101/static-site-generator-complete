import { htmlObjectToString } from "./html/html.functions.js";
import { format } from "prettier";
import {
    markdownToHtml,
    markdownStringToObject,
} from "./markdown/markdown.functions.js";
import fs from "fs/promises";

function converter(markdownString: string): string {
    const markdownTree = markdownStringToObject(markdownString);
    const htmlTree = markdownToHtml(markdownTree);
    const htmlString = htmlObjectToString(htmlTree);
    return htmlString;
}

async function formatedHtmlCreator(title: string, content: string) {
    const convertedContent = converter(content);
    const htmlTemplate = await fs.readFile("./src/resources/template.html", {
        encoding: "utf8",
    });
    const htmlContent = htmlTemplate
        .replace("{{ Title }}", title)
        .replace("{{ Content }}", convertedContent);
    // const htmlContent = `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    //     <meta charset="UTF-8" />
    //     <meta name="description" content="sample description" />
    //     <title>${title}</title>
    //     <link href="/index.css" rel="stylesheet">
    // </head>
    // <body>
    //     ${convertedContent}
    // </body>
    // </html>`;
    return await format(htmlContent, { parser: "html" });
}

export default formatedHtmlCreator;
