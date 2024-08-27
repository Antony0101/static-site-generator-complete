import { getConfig } from "./loadConfig.js";
import globalConstants from "../config/globalConstants.js";
import fs from "fs/promises";

export async function copyStyleFiles() {
    const config = await getConfig();
    const dist = config.outputDir + globalConstants.cssUrlPath;
    await fs.mkdir(dist);
    // copy default styles
    const defaultCss = globalConstants.defaultCssLocation;
    const styles = await fs.readFile(defaultCss, "utf-8");
    await fs.writeFile(dist + "/" + globalConstants.defaultCssUrlName, styles);
    // copy custom styles
    const customCss = config.stylesDir;
    console.log(customCss);
    const customStyles = await fs.readdir(customCss);
    for (const style of customStyles) {
        const styleContent = await fs.readFile(
            customCss + "/" + style,
            "utf-8",
        );
        await fs.writeFile(dist + "/" + style, styleContent);
    }
}
