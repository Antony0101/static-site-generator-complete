import { lexerNode } from "../markdown.lexer.js";
import MarkdownNode, { ContextType } from "../markdown.class.js";

function paragraphParser(
    input: lexerNode[],
    curIndex: number,
    context: ContextType[],
): { ast: MarkdownNode; nextNodeIndex: number } {
    return {
        ast: new MarkdownNode("paragraph", undefined),
        nextNodeIndex: 20,
    };
}

export default paragraphParser;
