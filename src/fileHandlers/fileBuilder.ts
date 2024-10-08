import fs from "fs/promises";
import joi from "joi";
import path from "path";
import formatedHtmlCreator from "../converter.js";
import { getConfig } from "./loadConfig.js";

export const parsePages = async (SourcePath?: string) => {
    let { sourceDir, outputDir } = await getConfig();
    sourceDir = sourceDir + "/pages";
    const currentSource = SourcePath || sourceDir;
    if (SourcePath === undefined) {
        const destExist = !!(await fs.stat(outputDir).catch(() => null));
        if (destExist) {
            await fs.rm(outputDir, { recursive: true, force: true });
        }
        await fs.mkdir(outputDir);
    } else {
        await fs.mkdir(
            path.join(outputDir, path.relative(sourceDir, SourcePath)),
        );
    }
    const files = await fs.readdir(currentSource);
    for (const file of files) {
        const filePath = path.join(currentSource, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            await parsePages(filePath);
            continue;
        }
    }
    const content = await fs.readFile(
        path.join(currentSource, "content.md"),
        "utf8",
    );
    const meta = await fs.readFile(
        path.join(currentSource, "meta.json"),
        "utf8",
    );
    const metaObject = JSON.parse(meta);
    const metaSchema = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        keywords: joi.array().items(joi.string()).required(),
        author: joi.string().required(),
        template: joi.string().default("default"),
        css: joi.array().items(joi.string()).default([]),
        scripts: joi.array().items(joi.string()).default([]),
    });
    const { error, value } = metaSchema.validate(metaObject);
    if (error) {
        throw error;
    }
    const html = await formatedHtmlCreator(content, value);

    const relativePath = path.relative(sourceDir, currentSource);
    const destinationPath = path.join(outputDir, relativePath) + "/index.html";
    await fs.writeFile(destinationPath, html);
};
