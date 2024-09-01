// this not full lexer as the node meaning in markdown depends on the context. So this lexer is not going to seperate the markdown into tokens. Instead it is to seperate the special characters and text.

import { count } from "console";

// symbols used in markdown with special meaning are: #,-,*,_,\,<,>,.,+,`,(,),[,],",|,!,:,~

export type lexerNodeNames =
    | "text"
    | "num"
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
    | "("
    | ")"
    | "["
    | "]"
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

const textSplitterRegex = /([0-9]+)/g;

export function primitiveMarkdownLexer(source: string): lexerNode[] {
    const nodes: lexerNode[] = [];
    let content = source;
    let isEscaped = false;
    while (content) {
        const match = content.match(lexerRegex);
        if (!match) {
            break;
        }
        if (match[1] === "" && match[2] === "") {
            break;
        }
        if (match[1]) {
            const nums = match[1].match(textSplitterRegex);
            if (nums) {
            }
            // handle the case where the previous text is escaped
            if (isEscaped) {
                const lastNode = nodes[nodes.length - 1];
                if (lastNode && lastNode.type === "text") {
                    lastNode.content += match[1];
                    lastNode.contentLength += match[1].length;
                } else {
                    nodes.push({
                        type: "text",
                        content: match[1],
                        contentLength: match[1].length,
                    });
                }
                isEscaped = false;
                content = content.slice(match[1].length);
                continue;
            }
            nodes.push({
                type: "text",
                content: match[1],
                contentLength: match[1].length,
            });
            content = content.slice(match[1].length);
        } else {
            const specialChar = match[2];
            // handle escaped characters
            if (specialChar === "\\") {
                const lastNode = nodes[nodes.length - 1];
                if (lastNode && lastNode.type === "text") {
                    lastNode.content += content[1];
                    lastNode.contentLength++;
                } else {
                    nodes.push({
                        type: "text",
                        content: content[1],
                        contentLength: 1,
                    });
                }
                content = content.slice(2);
                isEscaped = true;
                continue;
            }
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
    const proccessedNodes: lexerNode[] = [];
    for (const node of nodes) {
        if (node.type === "text") {
            const nums = node.content.match(textSplitterRegex);
            let curContent = node.content;
            if (nums) {
                for (const num of nums) {
                    const charIndex = curContent.indexOf(num);
                    const split = [
                        curContent.slice(0, charIndex),
                        curContent.slice(charIndex + num.length),
                    ];
                    if (split[0]) {
                        proccessedNodes.push({
                            type: "text",
                            content: split[0],
                            contentLength: split[0].length,
                        });
                    }
                    if (num) {
                        proccessedNodes.push({
                            type: "num",
                            content: num,
                            contentLength: num.length,
                        });
                    }
                    curContent = split[1];
                }
                if (curContent) {
                    proccessedNodes.push({
                        type: "text",
                        content: curContent,
                        contentLength: curContent.length,
                    });
                }
                continue;
            }
            proccessedNodes.push(node);
            continue;
        }
        proccessedNodes.push(node);
    }
    return proccessedNodes;
}
