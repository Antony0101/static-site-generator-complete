import { htmlObjectToString } from "./html/html.functions.js";
import { format } from "prettier";
import {
    markdownToHtml,
    markdownStringToObject,
} from "./markdown/markdown.functions.js";
import fs from "fs/promises";
import { getTemplate } from "./fileHandlers/loadTemplate.js";
import globalConstants from "./config/globalConstants.js";
import { getConfig } from "./fileHandlers/loadConfig.js";

function converter(markdownString: string): string {
    const markdownTree = markdownStringToObject(markdownString);
    const htmlTree = markdownToHtml(markdownTree);
    const htmlString = htmlObjectToString(htmlTree);
    return htmlString;
}

type Meta = {
    title?: string;
    description?: string;
    keywords: string[];
    author?: string;
    template?: string;
    css: string[];
    scripts: string[];
};

async function formatedHtmlCreator(content: string, meta: Meta) {
    const config = await getConfig();
    const convertedContent = converter(content);
    let htmlTemplate = await getTemplate(meta.template);
    let title = meta.title || "";
    let metaString = "";
    if (meta.description) {
        metaString += `<meta name="description" content="${meta.description}">`;
    }
    if (meta.keywords && meta.keywords.length > 0) {
        metaString += `<meta name="keywords" content="${meta.keywords.join(
            ", ",
        )}">`;
    }
    if (meta.author) {
        metaString += `<meta name="author" content="${meta.author}">`;
    }
    if (meta.css && meta.css.length > 0) {
        meta.css.forEach((css) => {
            metaString += `<link rel="stylesheet" href="${globalConstants.cssUrlPath + "/" + css}">`;
        });
    }
    if (meta.scripts && meta.scripts.length > 0) {
        meta.scripts.forEach((script) => {
            metaString += `<script src="${script}"></script>`;
        });
    }
    const htmlContent = htmlTemplate
        .replace("{{ Title }}", title)
        .replace("{{ Content }}", convertedContent)
        .replace("{{ Meta }}", metaString);
    return await format(htmlContent, { parser: "html" });
}

export default formatedHtmlCreator;
