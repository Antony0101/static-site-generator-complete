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

function parseLinks(markupNodes: MarkupNode[]) {
    // assuming first function to called. so markupNode is text node and with content and no children.
    const newNodes: MarkupNode[] = [];
    for (const markupNode of markupNodes) {
        const parts =
            markupNode.content?.match(/(^|\B|\s|[^!])\[(.*?)\]\((.*?)\)/g) ||
            [];
        if (parts.length === 0) {
            newNodes.push(markupNode);
            continue;
        }
        const content = markupNode.content;
    }
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

export { inlineParser, matchAllGenerator };
