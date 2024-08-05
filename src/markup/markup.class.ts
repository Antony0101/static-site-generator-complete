export type MarkupElements =
    // blocks
    | "heading1"
    | "heading2"
    | "heading3"
    | "heading4"
    | "heading5"
    | "heading6"
    | "paragraph"
    | "blockQuote"
    | "codeBlock"
    // inline
    | "lineBreak"
    | "text"
    | "bold"
    | "italic"
    | "code"
    | "link"
    | "image";

class MarkupNode {
    element: MarkupElements;
    content?: string;
    children?: MarkupNode[];
    link?: string;
    metadata: {
        title?: string;
    };

    constructor(
        element: MarkupElements,
        children?: MarkupNode[],
        content?: string,
        link?: string,
        metadata?: { title?: string },
    ) {
        this.element = element;
        this.children = children;
        this.content = content;
        this.link = link;
        this.metadata = metadata ?? {};
    }
}

export default MarkupNode;
