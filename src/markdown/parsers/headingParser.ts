import { lexerNode } from "../markdown.lexer.js";
import MarkdownNode, { ContextType } from "../markdown.class.js";

function headingParser(
    input: lexerNode[],
    curIndex: number,
    context: ContextType[],
): { ast: MarkdownNode; nextNodeIndex: number } {
    return {
        ast: new MarkdownNode("heading", undefined),
        nextNodeIndex: 20,
    };
}

export default headingParser;
