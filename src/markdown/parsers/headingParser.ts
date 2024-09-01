import MarkdownNode from "../markdown.class.js";
import { sampleTagListValue } from "../markdown.parser.js";

function headingParser(
    input: string,
    context: sampleTagListValue,
): { ast: MarkdownNode; characterCount: number } {
    return {
        ast: new MarkdownNode("heading1", undefined, input),
        characterCount: 20,
    };
}

export default headingParser;
