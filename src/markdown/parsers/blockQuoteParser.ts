import MarkdownNode from "../markdown.class.js";
import { sampleTagListValue } from "../markdown.parser.js";

function blockQuoteParser(
    input: string,
    context: sampleTagListValue,
): { ast: MarkdownNode; characterCount: number } {
    return {
        ast: new MarkdownNode("blockQuote", undefined, input),
        characterCount: 20,
    };
}

export default blockQuoteParser;
