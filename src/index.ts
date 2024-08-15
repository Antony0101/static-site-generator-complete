import { ConvertMarkupFilesToHtmlFiles } from "./fileHandlers/directoryReader.js";

async function build() {
    await ConvertMarkupFilesToHtmlFiles("./contents", "./public");
}

build().catch((e) => console.log(e));
