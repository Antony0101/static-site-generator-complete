export const MarkdownElementsList = {
    blockQuote: "blockQuote",
    breakLine: "breakLine",
    breakThematic: "breakThematic",
    codeBlock: "codeBlock",
    codeFenced: "codeFenced",
    codeInline: "codeInline",
    footnote: "footnote",
    footnoteReference: "footnoteReference",
    gfmTask: "gfmTask",
    heading: "heading",
    headingSetext: "headingSetext",
    /** only available if not `disableHTMLParsing` */
    htmlBlock: "htmlBlock",
    htmlComment: "htmlComment",
    /** only available if not `disableHTMLParsing` */
    htmlSelfClosing: "htmlSelfClosing",
    image: "image",
    link: "link",
    /** emits a `link` 'node', does not render directly */
    linkAngleBraceStyleDetector: "linkAngleBraceStyleDetector",
    /** emits a `link` 'node', does not render directly */
    linkBareUrlDetector: "linkBareUrlDetector",
    /** emits a `link` 'node', does not render directly */
    linkMailtoDetector: "linkMailtoDetector",
    newlineCoalescer: "newlineCoalescer",
    orderedList: "orderedList",
    paragraph: "paragraph",
    ref: "ref",
    refImage: "refImage",
    refLink: "refLink",
    table: "table",
    tableSeparator: "tableSeparator",
    text: "text",
    textBolded: "textBolded",
    textEmphasized: "textEmphasized",
    textEscaped: "textEscaped",
    textMarked: "textMarked",
    textStrikethroughed: "textStrikethroughed",
    unorderedList: "unorderedList",
    void: "void",
} as const;

export type MarkdownElementType =
    (typeof MarkdownElementsList)[keyof typeof MarkdownElementsList];

export const Context = {
    void: "void",
    paragraph: "paragraph",
    blockQuote: "blockQuote",
    codeBlock: "codeBlock",
    orderedList: "orderedList",
    unorderedList: "unorderedList",
    heading: "heading",
} as const;

export type ContextType = (typeof Context)[keyof typeof Context];

class MarkdownNode {
    element: MarkdownElementType;
    content?: string;
    children?: MarkdownNode[];
    metadata: {
        title?: string;
        link?: string;
    };

    constructor(
        element: MarkdownElementType,
        children?: MarkdownNode[] | string,
        metadata?: { title?: string; link?: string },
    ) {
        this.element = element;
        if (typeof children === "string") {
            this.content = children;
        } else {
            this.children = children;
        }
        this.metadata = metadata ?? {};
    }
}

export default MarkdownNode;
