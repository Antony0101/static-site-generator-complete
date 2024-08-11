import MarkupNode, { MarkupElements } from "./markup.class";

function* matchAllGenerator(value: string, regex: RegExp) {
    // won't support global regex
    if (regex.global) {
        throw new Error(
            "Regex contains global flag, won't work with regex with global flag",
        );
    }
    let str = value;
    while (true) {
        const result = str.match(regex);
        if (!result || result.index === undefined) {
            return undefined;
        } else {
            str = str.substring(result.index + result[0].length);
            yield result;
        }
    }
}

function parseNodesDelimiter(
    markupNodes: MarkupNode[],
    delimiter: string,
    nodeType: MarkupElements,
) {
    const newNodes: MarkupNode[] = [];
    for (const markupNode of markupNodes) {
        if (markupNode.children) {
            markupNode.children = parseNodesDelimiter(
                markupNode.children,
                delimiter,
                nodeType,
            );
            newNodes.push(markupNode);
            continue;
        }
        if (!markupNode.content) {
            newNodes.push(markupNode);
            continue;
        }
        let content = markupNode.content;
        const parts = content.split(delimiter);
        if (parts.length % 2 === 0) {
            throw new Error(`Closing delimiter ${delimiter} not found`);
        }
        const children: MarkupNode[] = [];
        if (parts.length === 1) {
            newNodes.push(markupNode);
            continue;
        }
        parts.forEach((part, index) => {
            if (!part) {
                return;
            }
            if (index % 2 === 0) {
                children.push(new MarkupNode("text", undefined, part));
            } else {
                children.push(new MarkupNode(nodeType, undefined, part));
            }
        });
        if (markupNode.element === "text") {
            newNodes.push(...children);
        } else {
            markupNode.children = children;
            markupNode.content = undefined;
            newNodes.push(markupNode);
        }
    }
    return newNodes;
}

function parseLinks(markupNodes: MarkupNode[]): MarkupNode[] {
    // assuming first function to called. so markupNode is text node and with content and no children.
    const newNodes: MarkupNode[] = [];
    // below regex will match every []() except ![]()
    const linkRegex = /(^|\B|\s|[^!])\[(.*?)\]\((.*?)\)/;
    // this regex also captures the character before [  so i have to handle it seperately ( i don't know how to modify this regex to prevent that capture. )
    for (const markupNode of markupNodes) {
        // const parts =
        //     markupNode.content?.match(/(^|\B|\s|[^!])\[(.*?)\]\((.*?)\)/g) ||
        //     [];
        const parts = [];
        if (!markupNode.content) {
            newNodes.push(markupNode);
            continue;
        }
        for (const data of matchAllGenerator(markupNode.content, linkRegex)) {
            parts.push(data);
        }
        if (parts.length === 0) {
            newNodes.push(markupNode);
            continue;
        }
        let content = markupNode.content;
        for (const part of parts) {
            const contentSplits = content.split(part[0], 2);
            content = contentSplits[1];
            if (contentSplits[0]) {
                newNodes.push(
                    new MarkupNode(
                        "text",
                        undefined,
                        contentSplits[0] + part[1],
                    ),
                );
            }
            const part2 = part[3];
            const [link, title, ...discard] = part2.split('"');
            newNodes.push(
                new MarkupNode("link", undefined, part[2], link.trim(), {
                    title,
                }),
            );
        }
        if (content) {
            newNodes.push(new MarkupNode("text", undefined, content));
        }
    }
    return newNodes;
}

function parseImages(markupNodes: MarkupNode[]) {
    // assuming first function to called. so markupNode is text node and with content and no children.
    const newNodes: MarkupNode[] = [];
    // below regex will match only ![]()
    const imageRegex = /!\[(.*?)\]\((.*?)\)/;
    for (const markupNode of markupNodes) {
        if (markupNode.children) {
            markupNode.children = parseImages(markupNode.children);
            newNodes.push(markupNode);
            continue;
        }
        if (!markupNode.content) {
            newNodes.push(markupNode);
            continue;
        }
        const parts = [];
        for (const data of matchAllGenerator(markupNode.content, imageRegex)) {
            parts.push(data);
        }
        if (parts.length === 0) {
            newNodes.push(markupNode);
            continue;
        }
        let content = markupNode.content;
        for (const part of parts) {
            const contentSplits = content.split(part[0], 2);
            content = contentSplits[1];
            if (contentSplits[0]) {
                newNodes.push(
                    new MarkupNode("text", undefined, contentSplits[0]),
                );
            }
            const part2 = part[2];
            const [link, title, ...discard] = part2.split('"');
            newNodes.push(
                new MarkupNode("image", undefined, part[1], link.trim(), {
                    title,
                }),
            );
        }
        if (content) {
            newNodes.push(new MarkupNode("text", undefined, content));
        }
    }
    return newNodes;
}

function inlineParser(value: string): MarkupNode[] {
    // currently won't support image within link
    let markupnodes: MarkupNode[] = [new MarkupNode("text", undefined, value)];
    markupnodes = parseLinks(markupnodes);
    markupnodes = parseImages(markupnodes);
    markupnodes = parseNodesDelimiter(markupnodes, "**", "bold");
    markupnodes = parseNodesDelimiter(markupnodes, "*", "italic");
    markupnodes = parseNodesDelimiter(markupnodes, "`", "code");

    return markupnodes;
}

export {
    inlineParser,
    matchAllGenerator,
    parseLinks,
    parseImages,
    parseNodesDelimiter,
};
