import { lexerNode } from "../markdown.lexer.js";
import MarkdownNode, {
    ContextType,
    MarkdownElementType,
} from "../markdown.class.js";

function innerParser(
    input: lexerNode[],
    curIndex: number,
    context: ContextType[],
): { ast: MarkdownNode[]; nextNodeIndex: number } {
    let prevElem: { value: MarkdownElementType | null } = { value: null };
    const mNodes: MarkdownNode[] = [];
    let i = 0;
    for (i = curIndex; i < input.length; i++) {
        switch (input[i].type) {
            // text
            case "text": {
                addTextNode(prevElem, mNodes, input[i]);
                break;
            }
            // number
            case "num": {
                addTextNode(prevElem, mNodes, input[i]);
                break;
            }
            // bold and italic *
            case "*": {
                switch (input[i].contentLength) {
                    case 1: {
                        i = processBoldAndItalic(
                            prevElem,
                            mNodes,
                            "*",
                            1,
                            input,
                            i,
                            context,
                        );
                        break;
                    }
                    case 2: {
                        i = processBoldAndItalic(
                            prevElem,
                            mNodes,
                            "*",
                            2,
                            input,
                            i,
                            context,
                        );
                        break;
                    }
                    case 3: {
                        i = processBoldAndItalic(
                            prevElem,
                            mNodes,
                            "*",
                            3,
                            input,
                            i,
                            context,
                        );
                        break;
                    }
                    default: {
                        addTextNode(prevElem, mNodes, input[i]);
                    }
                }
                break;
            }
            // bold and italic _
            case "_": {
                switch (input[i].contentLength) {
                    case 1: {
                        i = processBoldAndItalic(
                            prevElem,
                            mNodes,
                            "_",
                            1,
                            input,
                            i,
                            context,
                        );
                        break;
                    }
                    case 2: {
                        i = processBoldAndItalic(
                            prevElem,
                            mNodes,
                            "_",
                            2,
                            input,
                            i,
                            context,
                        );
                        break;
                    }
                    case 3: {
                        i = processBoldAndItalic(
                            prevElem,
                            mNodes,
                            "_",
                            3,
                            input,
                            i,
                            context,
                        );
                        break;
                    }
                    default: {
                        addTextNode(prevElem, mNodes, input[i]);
                    }
                }
                break;
            }
            case "`": {
                switch (input[i].contentLength) {
                    case 1: {
                        i = processCode(prevElem, mNodes, input, i, context);
                        break;
                    }
                    default: {
                        addTextNode(prevElem, mNodes, input[i]);
                    }
                }
                break;
            }
            default: {
                addTextNode(prevElem, mNodes, input[i]);
            }
        }
    }
    return { ast: mNodes, nextNodeIndex: i };
}

function processBoldAndItalic(
    prevElem: { value: MarkdownElementType | null },
    mNodes: MarkdownNode[],
    type: "*" | "_",
    contentLength: number,
    input: lexerNode[],
    index: number,
    context: ContextType[],
) {
    const innerContent: lexerNode[] = [];
    let flag = false;
    let i = index;
    i++;
    while (i < input.length) {
        if (
            input[i].type === type &&
            input[i].contentLength === contentLength
        ) {
            flag = true;
            break;
        }
        innerContent.push(input[i]);
        i++;
    }
    if (flag) {
        const { ast, nextNodeIndex } = innerParser(innerContent, 0, context);
        // convert ast to string if it is a single text node
        const result =
            ast.length === 1 && ast[0].element === "text"
                ? ast[0].content
                : ast;
        if (contentLength === 1) {
            mNodes.push(new MarkdownNode("textEmphasized", result));
            prevElem.value = "textEmphasized";
        }
        if (contentLength === 2) {
            mNodes.push(new MarkdownNode("textBolded", result));
            prevElem.value = "textBolded";
        }
        if (contentLength === 3) {
            mNodes.push(
                new MarkdownNode("textBolded", [
                    new MarkdownNode("textEmphasized", result),
                ]),
            );
            prevElem.value = "textBolded";
        }
        return i;
    } else {
        addTextNode(prevElem, mNodes, input[index]);
        return index;
    }
}

function processCode(
    prevElem: { value: MarkdownElementType | null },
    mNodes: MarkdownNode[],
    input: lexerNode[],
    index: number,
    context: ContextType[],
) {
    const innerContent: lexerNode[] = [];
    let flag = false;
    let i = index;
    i++;
    while (i < input.length) {
        if (input[i].type === "`" && input[i].contentLength === 1) {
            flag = true;
            break;
        }
        innerContent.push(input[i]);
        i++;
    }
    if (flag) {
        const { ast, nextNodeIndex } = innerParser(innerContent, 0, context);
        // convert ast to string if it is a single text node
        const result =
            ast.length === 1 && ast[0].element === "text"
                ? ast[0].content
                : ast;
        mNodes.push(new MarkdownNode("codeInline", result));
        prevElem.value = "codeInline";
        return i;
    } else {
        addTextNode(prevElem, mNodes, input[index]);
        return index;
    }
}

function addTextNode(
    prevElem: { value: MarkdownElementType | null },
    mNodes: MarkdownNode[],
    input: lexerNode,
) {
    if (prevElem.value === "text") {
        mNodes[mNodes.length - 1].content += input.content;
    } else {
        mNodes.push(new MarkdownNode("text", input.content));
    }
    prevElem.value = "text";
}

export default innerParser;
export { innerParser };
