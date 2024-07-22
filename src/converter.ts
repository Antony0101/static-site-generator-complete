function converter(markupString:string):string{
    const markupObject = markupStringToObject(markupString)
    const htmlObject = markupToHtml(markupObject)
    const htmlString = htmlObjectToString(htmlObject)
    return htmlString
}