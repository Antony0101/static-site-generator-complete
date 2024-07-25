class HtmlNode {
    tag: string | null;
    props: { [key: string]: string };
    value: string | undefined;
    children: HtmlNode[] | undefined;

    constructor(
        tag: string | null,
        props: { [key: string]: string },
        value?: string,
        children?: HtmlNode[],
    ) {
        this.value = value;
        this.props = props;
        this.children = children;
        this.tag = tag;
    }

    props_to_html(): string {
        if (!this.props) return "";
        let str: string = "";
        Object.entries(this.props).forEach((prop) => {
            str += ` ${prop[0]}="${prop[1]}"`;
        });
        return str.trim();
    }

    to_html(): string {
        const propsString = this.props_to_html();
        if (!this.tag) {
            return this.value || "";
        }
        if (this.children && Array.isArray(this.children)) {
            let str = propsString
                ? `<${this.tag} ${propsString}>`
                : `<${this.tag}>`;
            this.children.forEach((child) => {
                str += `${child.to_html()}`;
            });
            str += `</${this.tag}>`;
            return str;
        }
        if (this.value) {
            return propsString
                ? `<${this.tag} ${propsString}>${this.value}</${this.tag}>`
                : `<${this.tag}>${this.value}</${this.tag}>`;
        }
        return propsString
            ? `<${this.tag} ${this.props_to_html()}/>`
            : `<${this.tag}/>`;
    }
}

export default HtmlNode;
