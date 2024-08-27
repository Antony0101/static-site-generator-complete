import { ConvertMarkdownFilesToHtmlFiles } from "./fileHandlers/directoryReader.js";
import { parsePages } from "./fileHandlers/fileBuilder.js";
import { getConfig } from "./fileHandlers/loadConfig.js";

async function build() {
    const config = await getConfig();
    await parsePages();
    // await ConvertMarkdownFilesToHtmlFiles("./pages", "./public");
}

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Application specific logging, throwing an error, or other logic here
});

process.on("uncaughtException", (error) => {
    console.error(error);
    // process.exit(1); // exit application
});

build(); //.catch((e) => console.log(e));
