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
            case "!": {
                i = processImageAndLink(prevElem, mNodes, input, i, context);
                break;
            }
            case "[": {
                i = processImageAndLink(prevElem, mNodes, input, i, context);
                break;
            }
            default: {
                addTextNode(prevElem, mNodes, input[i]);
            }
        }
    }
    return { ast: mNodes, nextNodeIndex: i };
}

// [![An old rock in the desert](/assets/images/shiprock.jpg "Shiprock, New Mexico by Beau Rogers")](https://www.flickr.com/photos/beaurogers/31833779864/in/photolist-Qv3rFw-34mt9F-a9Cmfy-5Ha3Zi-9msKdv-o3hgjr-hWpUte-4WMsJ1-KUQ8N-deshUb-vssBD-6CQci6-8AFCiD-zsJWT-nNfsgB-dPDwZJ-bn9JGn-5HtSXY-6CUhAL-a4UTXB-ugPum-KUPSo-fBLNm-6CUmpy-4WMsc9-8a7D3T-83KJev-6CQ2bK-nNusHJ-a78rQH-nw3NvT-7aq2qf-8wwBso-3nNceh-ugSKP-4mh4kh-bbeeqH-a7biME-q3PtTf-brFpgb-cg38zw-bXMZc-nJPELD-f58Lmo-bXMYG-bz8AAi-bxNtNT-bXMYi-bXMY6-bXMYv)

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

function processImageAndLink(
    prevElem: { value: MarkdownElementType | null },
    mNodes: MarkdownNode[],
    input: lexerNode[],
    index: number,
    context: ContextType[],
) {
    // const innerContent: lexerNode[] = [];
    // let flag = false;
    let i = index;
    if (input[i].type === "!" && input[i + 1].type === "[") {
        i += 2;
        return proccessImageAndLinkLowLevel(
            prevElem,
            mNodes,
            input,
            i,
            context,
            "image",
        );
    } else if (input[i].type === "[") {
        i++;
        return proccessImageAndLinkLowLevel(
            prevElem,
            mNodes,
            input,
            i,
            context,
            "link",
        );
    } else {
        addTextNode(prevElem, mNodes, input[index]);
        return index;
    }
}

function proccessImageAndLinkLowLevel(
    prevElem: { value: MarkdownElementType | null },
    mNodes: MarkdownNode[],
    input: lexerNode[],
    index: number,
    context: ContextType[],
    elementType: "image" | "link",
) {
    let i = index;
    const innerContent: lexerNode[] = [];
    let innerString1 = "";
    let flag = false;
    while (i < input.length) {
        let openBracket = 0;
        if (input[i].type === "[") {
            openBracket++;
        }
        if (input[i].type === "]") {
            if (openBracket === 0) {
                flag = true;
                break;
            }
            openBracket--;
        }
        innerContent.push(input[i]);
        innerString1 += input[i].content;
        i++;
    }
    let innerString2 = "";
    if (flag) {
        flag = false;
        i++;
        if (input[i].type === "(") {
            i++;
            while (i < input.length) {
                let openBracket = 0;
                if (input[i].type === "(") {
                    openBracket++;
                }
                if (input[i].type === ")") {
                    if (openBracket === 0) {
                        flag = true;
                        break;
                    }
                    openBracket--;
                }
                innerString2 += input[i].content;
                i++;
            }
        }
    }
    if (flag) {
        const [url, title] = innerString2.split(' "');
        if (elementType === "image") {
            mNodes.push(
                new MarkdownNode("image", innerString1, {
                    title: title?.replace('"', "") || "",
                    link: url,
                }),
            );
            prevElem.value = "image";
            return i;
        } else {
            const { ast, nextNodeIndex } = innerParser(
                innerContent,
                0,
                context,
            );
            // convert ast to string if it is a single text node
            const result =
                ast.length === 1 && ast[0].element === "text"
                    ? ast[0].content
                    : ast;
            mNodes.push(
                new MarkdownNode("link", result, {
                    title: title?.replace('"', "") || "",
                    link: url,
                }),
            );
            prevElem.value = "link";
            return i;
        }
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
