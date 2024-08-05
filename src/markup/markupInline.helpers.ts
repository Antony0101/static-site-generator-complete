import MarkupNode from "./markup.class";

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
    const newNodes = [];
    for (const markupNode of markupNodes) {
    }
}

function inlineParser(value: string): MarkupNode[] {
    const markupnodes: MarkupNode[] = [];
    return [new MarkupNode("text", [])];
}

export { inlineParser, matchAllGenerator, parseLinks };
