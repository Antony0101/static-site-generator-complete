import { ConvertMarkdownFilesToHtmlFiles } from "./fileHandlers/directoryReader.js";

async function build() {
    await ConvertMarkdownFilesToHtmlFiles("./contents", "./public");
}

build().catch((e) => console.log(e));
