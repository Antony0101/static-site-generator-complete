import fs from "fs/promises";
import path from "path";
import formatedHtmlCreator from "../converter.js";

async function ConvertMarkdownFilesToHtmlFiles(src: string, dest: string) {
    // finds files recursively
    async function applyActionToFileRecrusively(
        dir: string,
        action: (filePath: string) => Promise<void>,
        options?: {
            createDestinationDirectory?: boolean;
        },
    ) {
        const filesOrFolders = await fs.readdir(dir);
        for (const fileName of filesOrFolders) {
            const filePath = path.join(dir, fileName);
            const fileStat = await fs.stat(filePath);
            if (fileStat.isDirectory()) {
                if (options?.createDestinationDirectory) {
                    fs.mkdir(path.join(dest, path.relative(src, filePath)));
                }
                applyActionToFileRecrusively(filePath, action);
                continue;
            }
            await action(filePath);
        }
    }

    async function readMarkdownFiles(filePath: string) {
        if (filePath.split(".")[1] === "md") {
            const fileContent = await fs.readFile(filePath, {
                encoding: "utf8",
            });
            const fileName = path.basename(filePath);
            const relativePath = path.relative(src, filePath);
            const destinationPath =
                path.join(dest, relativePath).split(".")[0] + ".html";
            const converted = formatedHtmlCreator(fileName, fileContent);
            await fs.writeFile(destinationPath, converted);
        } else {
            const fileContent = await fs.readFile(filePath, {
                encoding: "binary",
            });
            const relativePath = path.relative(src, filePath);
            const destinationPath = path.join(dest, relativePath);
            await fs.writeFile(destinationPath, fileContent);
        }
    }

    const destExist = !!(await fs.stat(dest).catch(() => null));
    if (destExist) {
        await fs.rm(dest, { recursive: true, force: true });
    }
    await fs.mkdir(dest);
    // run the applyActionToFileRecrusively to proccessing
    await applyActionToFileRecrusively(src, readMarkdownFiles, {
        createDestinationDirectory: true,
    });
}

export { ConvertMarkdownFilesToHtmlFiles };
