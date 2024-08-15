# static-site-generator-complete

This is a static site generator that uses markdown files to generate a static site. Its still in development and not yet complete. Currntlly only the build command is implemented and will generate the static site in the public folder. Also the site is not yet styled. Currently only heading and paragraph blocks are supported. Most of the inline blocks are supported but will not work correctly when nested inside other inline blocks. However, the inline blocks will work correctly when nested inside a Heading or Paragraph block. As of now, the supported inline blocks are:

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
-   [ ] Update the content folder structure to add metadata to the markdown files
-   [ ] Add style sheet to the generated site
-   [ ] Add Tokenizer and a real Parser to parse the markdown files
-   [ ] Add support for more inline blocks
-   [ ] Add support for blockquotes
-   [ ] Add support for code blocks
-   [ ] Add support for lists
-   [ ] Update the content folder structure to add custom style sheets and scripts to the markdown files
