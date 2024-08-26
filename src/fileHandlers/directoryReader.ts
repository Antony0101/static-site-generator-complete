import fs from "fs/promises";
import path from "path";
import formatedHtmlCreator from "../converter.js";
import { format } from "prettier";

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

    // get default template and css.

    async function getDefaultFiles() {
        const defaultTemplate = await fs.readFile(
            path.join(__dirname, "../../templates/index.html"),
            { encoding: "utf8" },
        );
        const defaultCss = await fs.readFile(
            path.join(__dirname, "../../templates/styles.css"),
            { encoding: "utf8" },
        );
        return { defaultTemplate, defaultCss };
    }

    async function parseDirectoryAndTransform(
        dir: string,
        defaultFiles: { defaultTemplate: string; defaultCss: string },
    ) {
        let templateFile = defaultFiles.defaultTemplate;
        let cssFile = defaultFiles.defaultCss;
        const files = await fs.readdir(dir);
        // folder can only be of html or markdown not both if index.html is present markdown is ignored
        const filesObject = {} as any;
        files.forEach((file) => {
            filesObject[file] = path.join(dir, file);
        });
        if (filesObject["template.html"]) {
            templateFile = await fs.readFile(
                filesObject["template.html"],
                "utf-8",
            );
            delete filesObject["template.html"];
        }
        if (filesObject["styles.css"]) {
            cssFile = await fs.readFile(filesObject["styles.css"], "utf-8");
            delete filesObject["styles.css"];
        }
        if (filesObject["index.html"]) {
            const fileContent = await fs.readFile(
                filesObject["index.html"],
                "utf-8",
            );
            const formatedContent = await format(fileContent, {
                parser: "html",
            });
            const relativePath = path.relative(src, filesObject["index.html"]);
            const destinationPath = path.join(dest, relativePath);
            await fs.writeFile(destinationPath, formatedContent);
        }
        for (const fileName of files) {
            // const filePath = path.join(dir, fileName);
            // const fileStat = await fs.stat(filePath);
            // if (fileStat.isDirectory()) {
            //     await fs.mkdir(path.join(dest, path.relative(src, filePath)));
            //     parseDirectoryAndTransform(filePath, defaultFiles);
            //     continue;
            // }
            // if (fileName === "index.html") {
            //     const fileContent = await fs.readFile(filePath, {
            //         encoding: "binary",
            //     });
            //     const formatedContent = await format(fileContent, {
            //         parser: "html",
            //     });
            //     const relativePath = path.relative(src, filePath);
            //     const destinationPath = path.join(dest, relativePath);
            //     await fs.writeFile(destinationPath, formatedContent);
            // }
            // if (fileName === "style.css") {
            //     const fileContent = await fs.readFile(filePath, {
            //         encoding: "binary",
            //     });
            //     const formatedContent = await format(fileContent, {
            //         parser: "css",
            //     });
            //     const relativePath = path.relative(src, filePath);
            //     const destinationPath = path.join(dest, relativePath);
            //     await fs.writeFile(destinationPath, formatedContent);
            // }
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
            // const converted = await formatedHtmlCreator(fileName, fileContent);
            // await fs.writeFile(destinationPath, converted);
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
