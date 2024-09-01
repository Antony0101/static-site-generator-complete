// Don't know how to implement lexer and parser for markdown seperately as element type depends on the context and previous element type.
// so, I am going to implement lexer and parser together in a single class.

import MarkdownNode, { MarkdownElements } from "./markdown.class.js";
import blockQuoteParser from "./parsers/blockQuoteParser.js";
import headingParser from "./parsers/headingParser.js";
import paragraphParser from "./parsers/paragraphParser.js";

export const sampleTagList = {
    blockQuote: "0",
    breakLine: "1",
    breakThematic: "2",
    codeBlock: "3",
    codeFenced: "4",
    codeInline: "5",
    footnote: "6",
    footnoteReference: "7",
    gfmTask: "8",
    heading: "9",
    headingSetext: "10",
    /** only available if not `disableHTMLParsing` */
    htmlBlock: "11",
    htmlComment: "12",
    /** only available if not `disableHTMLParsing` */
    htmlSelfClosing: "13",
    image: "14",
    link: "15",
    /** emits a `link` 'node', does not render directly */
    linkAngleBraceStyleDetector: "16",
    /** emits a `link` 'node', does not render directly */
    linkBareUrlDetector: "17",
    /** emits a `link` 'node', does not render directly */
    linkMailtoDetector: "18",
    newlineCoalescer: "19",
    orderedList: "20",
    paragraph: "21",
    ref: "22",
    refImage: "23",
    refLink: "24",
    table: "25",
    tableSeparator: "26",
    text: "27",
    textBolded: "28",
    textEmphasized: "29",
    textEscaped: "30",
    textMarked: "31",
    textStrikethroughed: "32",
    unorderedList: "33",
    void: "34",
} as const;

export type sampleTagListValue =
    (typeof sampleTagList)[keyof typeof sampleTagList];

const Context = {
    void: 0,
    paragraph: 1,
    blockQuote: 2,
    codeBlock: 3,
    orderedList: 4,
    unorderedList: 5,
    heading: 6,
} as const;

class markdownParser {
    sourceString?: string;
    previousElement?: MarkdownElements;
    context: (typeof Context)[keyof typeof Context] = Context.void;
    constructor(sourceString: string) {
        this.sourceString = sourceString;
    }

    getNextBlock(): MarkdownNode | null {
        if (!this.sourceString) {
            return null;
        }
        this.sourceString = this.sourceString.trimStart();
        // line only contains whitespace characters
        if (!this.sourceString) {
            return null;
        }
        if (this.sourceString[0] === "#") {
            const result = headingParser(this.sourceString, sampleTagList.void);
            this.sourceString = this.sourceString.slice(result.characterCount);
            return result.ast;
        }
        if (this.sourceString[0] === ">") {
            const result = blockQuoteParser(
                this.sourceString,
                sampleTagList.void,
            );
        }
        const result = paragraphParser(this.sourceString, sampleTagList.void);
        this.sourceString = this.sourceString.slice(result.characterCount);
        return result.ast;
    }
}
