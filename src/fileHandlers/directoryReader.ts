import fs from "fs/promises";

async function readDirectoryContent() {
    const filesOrFolders = await fs.readdir("./contents");
    console.log(filesOrFolders);
}

export { readDirectoryContent };
