import MarkdownNode from "../markdown.class.js";
import { sampleTagListValue } from "../markdown.parser.js";

function innerParser(
    input: string,
    context: sampleTagListValue,
): { ast: MarkdownNode; characterCount: number } {
    const characterRegex = /([a-zA-Z0-9]*)/;
    let count = 0;
    const stack = [];
    let currentToken = "";
    while (input && input.length > 0) {
        const match = input.match(characterRegex);
        if (!match) {
            break;
        }
    }
    return {
        ast: new MarkdownNode("paragraph", undefined, input),
        characterCount: 20,
    };
}

export default innerParser;

function boldParser(
    input: string,
    context: sampleTagListValue,
): { ast: MarkdownNode; characterCount: number } {
    return {
        ast: new MarkdownNode("bold", undefined, input),
        characterCount: 20,
    };
}
