import MarkupNode from "./markup.class";
import { inlineParser } from "./markupInline.helpers";

function blockParser(blokString: string): MarkupNode {
    const stripedString = blokString.trimStart();
    switch (stripedString[0]) {
        case "#":
            return handleHeading(stripedString);
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
            marknode = new MarkupNode("heading1", []);
            break;
        case 2:
            marknode = new MarkupNode("heading2", []);
            break;
        case 3:
            marknode = new MarkupNode("heading3", []);
            break;
        case 4:
            marknode = new MarkupNode("heading4", []);
            break;
        case 5:
            marknode = new MarkupNode("heading5", []);
            break;
        case 6:
            marknode = new MarkupNode("heading6", []);
            break;
        default:
            throw new Error("heading block # count should be between 1 and 6");
    }
    const childString = value.slice(countHeading - 1).trimStart();
    const children = inlineParser(childString);
    marknode.children = children;
    return marknode;
}

function handleParagraph(value: string): MarkupNode {
    // expects a string starts with #
    if (value[0] !== "#") {
        throw new Error(
            "expects a heading block but current block starts with" + value[0],
        );
    }
    return new MarkupNode("heading1", []);
}
