export type MarkdownElements =
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
    | "orderedList"
    | "unorderedList"
    | "listElement"
    // inline
    | "lineBreak"
    | "text"
    | "bold"
    | "italic"
    | "code"
    | "link"
    | "image";

class MarkdownNode {
    element: MarkdownElements;
    content?: string;
    children?: MarkdownNode[];
    link?: string;
    metadata: {
        title?: string;
    };

    constructor(
        element: MarkdownElements,
        children?: MarkdownNode[],
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

export default MarkdownNode;
