class HtmlNode {
    tag: string | null;
    props: { [key: string]: string };
    value: string | undefined;
    children: HtmlNode[] | undefined;

    constructor(
        tag: string,
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
        return str;
    }

    to_html(): string {
        if (!this.tag) {
            return this.value || "";
        }
        if (this.children && Array.isArray(this.children)) {
            let str = ` <${this.tag} ${this.props_to_html()}>`;
            this.children.forEach((child) => {
                str += `${child.to_html()}`;
            });
            str += `</${this.tag}>`;
            return str;
        }
        if (this.value) {
            return ` <${this.tag} ${this.props_to_html()}>${this.value}</${this.tag}>`;
        }
        return ` <${this.tag} ${this.props_to_html()}/>`;
    }
}
