import MarkdownNode from "./markdown.class.js";
import { inlineParser } from "./markdownInline.helpers.js";

function assignChildrenOrContent(
    markdownNode: MarkdownNode,
    children: MarkdownNode[],
) {
    if (children.length === 0) {
        markdownNode.content = "";
    } else if (
        children.length === 1 &&
        children[0].element === "text" &&
        children[0].children === undefined
    ) {
        markdownNode.content = children[0].content;
    } else {
        markdownNode.children = children;
    }
    return markdownNode;
}

function blockParser(blokString: string): MarkdownNode {
    const stripedString = blokString.trimStart();
    switch (stripedString[0]) {
        case "#":
            return handleHeading(stripedString);
        case ">":
            return handleQuote(stripedString);
        default:
            return handleParagraph(stripedString);
    }
}

function handleHeading(value: string): MarkdownNode {
    // expects a string starts with #
    if (value[0] !== "#") {
        throw new Error(
            "expects a heading block but current block starts with" + value[0],
        );
    }
    let countHeading = 0;
    for (let i = 0; i <= value.length; i++) {
        if (value[i] === "#") {
            countHeading += 1;
        } else {
            break;
        }
    }
    let marknode: MarkdownNode;
    switch (countHeading) {
        case 1:
            marknode = new MarkdownNode("heading1");
            break;
        case 2:
            marknode = new MarkdownNode("heading2");
            break;
        case 3:
            marknode = new MarkdownNode("heading3");
            break;
        case 4:
            marknode = new MarkdownNode("heading4");
            break;
        case 5:
            marknode = new MarkdownNode("heading5");
            break;
        case 6:
            marknode = new MarkdownNode("heading6");
            break;
        default:
            throw new Error("heading block # count should be between 1 and 6");
    }
    const childString = value.slice(countHeading).trimStart();
    const children = inlineParser(childString);
    return assignChildrenOrContent(marknode, children);
}

function handleParagraph(value: string): MarkdownNode {
    const marknode = new MarkdownNode("paragraph");
    const children = inlineParser(value);
    return assignChildrenOrContent(marknode, children);
}

function handleQuote(value: string): MarkdownNode {
    const markNode = new MarkdownNode("blockQuote");
    const children = inlineParser(value.replace(">", ""));
    return assignChildrenOrContent(markNode, children);
}

// function handleUnorderedList(value:string):MarkdownNode {
//     // currently not implemented
// }

// function handleOrderedList(value:string):MarkdownNode {
//     // currently not implemented
// }

export { blockParser, handleHeading, handleParagraph };
