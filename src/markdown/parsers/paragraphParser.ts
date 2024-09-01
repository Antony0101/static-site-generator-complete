import MarkdownNode from "../markdown.class.js";
import { sampleTagListValue } from "../markdown.parser.js";

function paragraphParser(
    input: string,
    context: sampleTagListValue,
): { ast: MarkdownNode; characterCount: number } {
    return {
        ast: new MarkdownNode("paragraph", undefined, input),
        characterCount: 20,
    };
}

export default paragraphParser;
