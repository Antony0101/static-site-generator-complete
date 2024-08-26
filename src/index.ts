import { ConvertMarkdownFilesToHtmlFiles } from "./fileHandlers/directoryReader.js";
import { parsePages } from "./fileHandlers/fileBuilder.js";
import { getConfig } from "./fileHandlers/loadConfig.js";

async function build() {
    const config = await getConfig();
    console.log(config);
    await parsePages();
    // await ConvertMarkdownFilesToHtmlFiles("./pages", "./public");
}

build().catch((e) => console.log(e));
