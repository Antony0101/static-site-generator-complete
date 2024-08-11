import { readDirectoryContent } from "./fileHandlers/directoryReader.js";
async function build() {
    await readDirectoryContent();
}

build();
