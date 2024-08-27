import fs from "fs/promises";
import globalConstants from "../config/globalConstants.js";
import { getConfig } from "./loadConfig.js";

const templateCache = new Map<string, string>();

const readTemplate = async (templatePath: string) => {
    const template = await fs.readFile(templatePath, {
        encoding: "utf8",
    });
    return template;
};

export const getTemplate = async (templateName?: string) => {
    const config = await getConfig();
    if (templateName === undefined || templateName === "default") {
        if (templateCache.has("default")) {
            return templateCache.get("default")!;
        } else {
            const defaultTemplate = await readTemplate(
                globalConstants.defaultTemplateLocation,
            );
            templateCache.set("default", defaultTemplate);
            return defaultTemplate;
        }
    }
    if (templateCache.has(templateName)) {
        return templateCache.get(templateName)!;
    } else {
        const template = await readTemplate(
            config.templatesDir + "/" + templateName,
        );
        templateCache.set(templateName, template);
        return template;
    }
};
