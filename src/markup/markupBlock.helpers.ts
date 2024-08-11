import MarkupNode from "./markup.class";
import { inlineParser } from "./markupInline.helpers";

function assignChildrenOrContent(
    markupNode: MarkupNode,
    children: MarkupNode[],
) {
    if (children.length === 0) {
        markupNode.content = "";
    } else if (
        children.length === 1 &&
        children[0].element === "text" &&
        children[0].children === undefined
    ) {
        markupNode.content = children[0].content;
    } else {
        markupNode.children = children;
    }
    return markupNode;
}

function blockParser(blokString: string): MarkupNode {
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

function handleHeading(value: string): MarkupNode {
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
    let marknode: MarkupNode;
    switch (countHeading) {
        case 1:
            marknode = new MarkupNode("heading1");
            break;
        case 2:
            marknode = new MarkupNode("heading2");
            break;
        case 3:
            marknode = new MarkupNode("heading3");
            break;
        case 4:
            marknode = new MarkupNode("heading4");
            break;
        case 5:
            marknode = new MarkupNode("heading5");
            break;
        case 6:
            marknode = new MarkupNode("heading6");
            break;
        default:
            throw new Error("heading block # count should be between 1 and 6");
    }
    const childString = value.slice(countHeading).trimStart();
    const children = inlineParser(childString);
    return assignChildrenOrContent(marknode, children);
}

function handleParagraph(value: string): MarkupNode {
    const marknode = new MarkupNode("paragraph");
    const children = inlineParser(value);
    return assignChildrenOrContent(marknode, children);
}

function handleQuote(value: string): MarkupNode {
    const markNode = new MarkupNode("blockQuote");
    const children = inlineParser(value.replace(">", ""));
    return assignChildrenOrContent(markNode, children);
}

// function handleUnorderedList(value:string):MarkupNode {
//     // currently not implemented
// }

// function handleOrderedList(value:string):MarkupNode {
//     // currently not implemented
// }

export { blockParser, handleHeading, handleParagraph };
