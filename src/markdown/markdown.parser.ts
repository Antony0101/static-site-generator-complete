// Don't know how to implement lexer and parser for markdown seperately as element type depends on the context and previous element type.
// so, I am going to implement lexer and parser together in a single class.

import { MarkdownElements } from "./markdown.class.js";

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

    getNextToken() {
        if (!this.sourceString) {
            return null;
        }
    }
}
