import { htmlObjectToString } from "./html/html.functions";
import { markupToHtml, markupStringToObject } from "./markup/markup.functions";

function converter(markupString: string): string {
    const markupTree = markupStringToObject(markupString);
    const htmlTree = markupToHtml(markupTree);
    const htmlString = htmlObjectToString(htmlTree);
    return htmlString;
}
