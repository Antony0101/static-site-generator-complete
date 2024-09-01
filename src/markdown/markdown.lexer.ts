// this not full lexer as the node meaning in markdown depends on the context. So this lexer is not going to seperate the markdown into tokens. Instead it is to seperate the special characters and text.

// symbols used in markdown with special meaning are: #,-,*,_,\,<,>,.,+,`,(,),[,],",|,!,":",~

export type lexerNodeNames =
    | "text"
    | "#"
    | "-"
    | "*"
    | "_"
    | "\\"
    | "<"
    | ">"
    | "."
    | "+"
    | "`"
    | '"'
    | "|"
    | "!"
    | ":"
    | "~";
export type lexerNode = {
    type: lexerNodeNames;
    content: string;
    contentLength: number;
    [key: string]: any;
};

const lexerRegex = /^(.*?)([#\-\*_,\\<>.\+`\(\)\[\]"|!:~\n]|$)/;

export function primitiveMarkdownLexer(source: string): lexerNode[] {
    const nodes: lexerNode[] = [];
    let content = source;
    while (content) {
        const match = content.match(lexerRegex);
        if (!match) {
            break;
        }
        if (match[1] === "" && match[2] === "") {
            break;
        }
        if (match[1]) {
            nodes.push({
                type: "text",
                content: match[1],
                contentLength: match[1].length,
            });
            content = content.slice(match[1].length);
        } else {
            const specialChar = match[2];
            let stringIndex = 0;
            while (specialChar === content[stringIndex]) {
                stringIndex++;
            }
            nodes.push({
                type: specialChar as lexerNodeNames,
                content: content.slice(0, stringIndex),
                contentLength: stringIndex,
            });
            content = content.slice(stringIndex);
        }
    }
    return nodes;
}
