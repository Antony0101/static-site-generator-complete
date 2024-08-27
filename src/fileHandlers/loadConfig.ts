import fs from "fs/promises";
import joi from "joi";
import globalConstants from "../config/globalConstants.js";

export type Config = {
    sourceDir: string;
    outputDir: string;
    templatesDir: string;
    cssDir: string;
    scriptsDir: string;
};

let config: Config | undefined = undefined;

const readConfig = async (configPath: string) => {
    const config = await fs.readFile(configPath, {
        encoding: "utf8",
    });
    const configObject = JSON.parse(config);
    const schema = joi.object({
        sourceDir: joi.string().default("./contents"),
        outputDir: joi.string().default("./public"),
        templatesDir: joi.string().default("./contents/templates"),
        stylesDir: joi.string().default("./contents/styles"),
        scriptsDir: joi.string().default("./contents/scripts"),
    });
    const { error, value } = schema.validate(configObject);
    if (error) {
        throw error;
    }
    return value;
};

export const getConfig = async () => {
    if (config === undefined) {
        config = await readConfig(globalConstants.configLocation);
    }
    return config as Config;
};
