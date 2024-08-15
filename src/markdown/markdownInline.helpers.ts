import MarkdownNode, { MarkdownElements } from "./markdown.class.js";

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
    markdownNodes: MarkdownNode[],
    delimiter: string,
    nodeType: MarkdownElements,
) {
    const newNodes: MarkdownNode[] = [];
    for (const markdownNode of markdownNodes) {
        if (markdownNode.children) {
            markdownNode.children = parseNodesDelimiter(
                markdownNode.children,
                delimiter,
                nodeType,
            );
            newNodes.push(markdownNode);
            continue;
        }
        if (!markdownNode.content) {
            newNodes.push(markdownNode);
            continue;
        }
        let content = markdownNode.content;
        const parts = content.split(delimiter);
        if (parts.length % 2 === 0) {
            throw new Error(`Closing delimiter ${delimiter} not found`);
        }
        const children: MarkdownNode[] = [];
        if (parts.length === 1) {
            newNodes.push(markdownNode);
            continue;
        }
        parts.forEach((part, index) => {
            if (!part) {
                return;
            }
            if (index % 2 === 0) {
                children.push(new MarkdownNode("text", undefined, part));
            } else {
                children.push(new MarkdownNode(nodeType, undefined, part));
            }
        });
        if (markdownNode.element === "text") {
            newNodes.push(...children);
        } else {
            markdownNode.children = children;
            markdownNode.content = undefined;
            newNodes.push(markdownNode);
        }
    }
    return newNodes;
}

function parseLinks(markdownNodes: MarkdownNode[]): MarkdownNode[] {
    // assuming first function to called. so markdownNode is text node and with content and no children.
    const newNodes: MarkdownNode[] = [];
    // below regex will match every []() except ![]()
    // const linkRegex = /(^|\B|\s|[^!])\[(.*?)\]\((.*?)\)/;
    // this regex also captures the character before [  so i have to handle it seperately ( i don't know how to modify this regex to prevent that capture. )

    // below regex works fine (the problem of capture group still exist. i can use this regex /(?:^|[^!])\[(.*?)\]\((.*?)\)/ to create non capture group but still it is going to extract that first character )  i am keeping a above regex comments for future references as i am not good in regex.
    const linkRegex = /(^|[^!])\[(.*?)\]\((.*?)\)/;
    for (const markdownNode of markdownNodes) {
        // const parts =
        //     markdownNode.content?.match(/(^|\B|\s|[^!])\[(.*?)\]\((.*?)\)/g) ||
        //     [];
        const parts = [];
        if (!markdownNode.content) {
            newNodes.push(markdownNode);
            continue;
        }
        for (const data of matchAllGenerator(markdownNode.content, linkRegex)) {
            parts.push(data);
        }
        if (parts.length === 0) {
            newNodes.push(markdownNode);
            continue;
        }
        let content = markdownNode.content;
        for (const part of parts) {
            const contentSplits = content.split(part[0], 2);
            content = contentSplits[1];
            if (contentSplits[0]) {
                newNodes.push(
                    new MarkdownNode(
                        "text",
                        undefined,
                        contentSplits[0] + part[1],
                    ),
                );
            }
            const part2 = part[3];
            const [link, title, ...discard] = part2.split('"');
            newNodes.push(
                new MarkdownNode("link", undefined, part[2], link.trim(), {
                    title,
                }),
            );
        }
        if (content) {
            newNodes.push(new MarkdownNode("text", undefined, content));
        }
    }
    return newNodes;
}

function parseImages(markdownNodes: MarkdownNode[]) {
    // assuming first function to called. so markdownNode is text node and with content and no children.
    const newNodes: MarkdownNode[] = [];
    // below regex will match only ![]()
    const imageRegex = /!\[(.*?)\]\((.*?)\)/;
    for (const markdownNode of markdownNodes) {
        if (markdownNode.children) {
            markdownNode.children = parseImages(markdownNode.children);
            newNodes.push(markdownNode);
            continue;
        }
        if (!markdownNode.content) {
            newNodes.push(markdownNode);
            continue;
        }
        const parts = [];
        for (const data of matchAllGenerator(
            markdownNode.content,
            imageRegex,
        )) {
            parts.push(data);
        }
        if (parts.length === 0) {
            newNodes.push(markdownNode);
            continue;
        }
        let content = markdownNode.content;
        for (const part of parts) {
            const contentSplits = content.split(part[0], 2);
            content = contentSplits[1];
            if (contentSplits[0]) {
                newNodes.push(
                    new MarkdownNode("text", undefined, contentSplits[0]),
                );
            }
            const part2 = part[2];
            const [link, title, ...discard] = part2.split('"');
            newNodes.push(
                new MarkdownNode("image", undefined, part[1], link.trim(), {
                    title,
                }),
            );
        }
        if (content) {
            newNodes.push(new MarkdownNode("text", undefined, content));
        }
    }
    return newNodes;
}

function inlineParser(value: string): MarkdownNode[] {
    // currently won't support image within link
    let markdownnodes: MarkdownNode[] = [
        new MarkdownNode("text", undefined, value),
    ];
    markdownnodes = parseLinks(markdownnodes);
    markdownnodes = parseImages(markdownnodes);
    markdownnodes = parseNodesDelimiter(markdownnodes, "**", "bold");
    markdownnodes = parseNodesDelimiter(markdownnodes, "*", "italic");
    markdownnodes = parseNodesDelimiter(markdownnodes, "`", "code");

    return markdownnodes;
}

export {
    inlineParser,
    matchAllGenerator,
    parseLinks,
    parseImages,
    parseNodesDelimiter,
};
