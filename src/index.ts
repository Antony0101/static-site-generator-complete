import { copyStyleFiles } from "./fileHandlers/copyStaticFiles.js";
import { parsePages } from "./fileHandlers/fileBuilder.js";
import { getConfig } from "./fileHandlers/loadConfig.js";

async function build() {
    const config = await getConfig();
    await parsePages();
    await copyStyleFiles();
}

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
    console.error(error);
});

build().catch((e) => console.log(e));
