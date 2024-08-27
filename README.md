# static-site-generator-complete

This is a static site generator that uses markdown files to generate a static site. Its still in development and not yet complete. Currentlly only the build command is implemented and will generate the static site in the public folder. Also the site is not yet styled. Currently only heading and paragraph blocks are supported. Most of the inline blocks are supported but will not work correctly when nested inside other inline blocks. However, the inline blocks will work correctly when nested inside a Heading or Paragraph block. As of now, the supported inline blocks are:

-   Bold
-   Italic
-   Link
-   Image
-   Inline Code

Also due to the lack of a decent parser, it will behave incorrectly in many cases.

## Installation

```bash
npm install
```

## Usage

not yet implemented completely.(currently only the build command is implemented and will generate the static site in the public folder)

```bash
npm run build
```

## Goals

-   [x] Generate static site from markdown files
-   [x] Update the content folder structure to add metadata to the markdown files
-   [x] Add style sheet to the generated site
-   [ ] Add Tokenizer and a real Parser to parse the markdown files
-   [ ] Add support for more inline blocks
-   [ ] Add support for blockquotes
-   [ ] Add support for code blocks
-   [ ] Add support for lists
-   [ ] Update the content folder structure to add custom style sheets and scripts to the markdown files

## Pages Folder Structure

It is a file based routing system. The contents/page folder structure will be converted to the site structure. The contents/pages folder structure should be as follows:

Folder can contain content.md file and meta.json file. The content.md file will contain the content of the page and the meta.json file will contain the metadata of the page. The meta.json file should contain the following fields: title, description, keywords, author, template, css and scripts. Folder can contain any number of subfolders and each subfolder can contain content.md and meta.json files. The site structure will be generated based on the folder structure of the contents/pages folder. The generated site will be in the public folder. The templates are in the contents/templates folder. The css and scripts are in the contents/css and contents/scripts folders respectively.
