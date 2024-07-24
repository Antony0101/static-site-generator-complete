type MarkupElements =
    | "heading1"
    | "heading2"
    | "text"
    | "bold"
    | "italic"
    | "code";

class MarkupNode {
    element: MarkupElements;
    content?: string;
    children?: MarkupNode[];
    link?: string;

    constructor(
        element: MarkupElements,
        children?: MarkupNode[],
        content?: string,
        link?: string,
    ) {
        this.element = element;
        this.children = children;
        this.content = content;
        this.link = link;
    }
}
