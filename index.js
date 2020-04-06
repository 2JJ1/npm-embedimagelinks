const fetch = require("node-fetch")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//Replaces from DOM
function replaceTextInDOM(dom, element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case dom.window.Node.ELEMENT_NODE:
                replaceTextInDOM(dom, node, pattern, replacement);
                break;
            case dom.window.Node.TEXT_NODE:
                var txt = dom.window.document.createElement("span");
                txt.innerHTML = node.textContent.replace(pattern, replacement);
                node.replaceWith(txt);
                break;
            case dom.window.Node.DOCUMENT_NODE:
                replaceTextInDOM(dom, node, pattern, replacement);
        }
    }
}

/**
 * Searches for https links in the HTML and replaces it with an image tag.
 * @param html The HTML as a string containing the links
 * @param options An object which contains your options
 */
module.exports = async function(html, options){
    //Default options
    options = {}
    options.gyazo = "gyazo" in options ? options.gyazo : true
    options.imgur = "imgur" in options ? options.imgur : true
    options.imgFile = "imgFile" in options ? options.imgFile : true

    var dom = new JSDOM(html)

    if(options.gyazo){
        var gyazoLinks = html.matchAll(/https:\/\/gyazo.com\/\w*/g)
        for (const match of gyazoLinks) {
            //Get the raw URL from Gyazo
            await fetch(`https://api.gyazo.com/api/oembed?url=${match[0]}`)
            .then(res => res.json())
            .then(res => {
                let rx = new RegExp(match[0])
                let newTag = `<img src="${res.url}"/>`
                replaceTextInDOM(dom, dom.window.document.body, rx, newTag)
            })
            .catch()
        }
    }

    if(options.imgur){
        var imgurLinks = html.matchAll(/https:\/\/imgur.com\/(a|gallery)\/(\w*)/g)
        for (const match of imgurLinks) {
            await fetch(`https://api.imgur.com/oembed?url=${match[0]}`)
            .then(res => res.json())
            .then(res => {
                let rx = new RegExp(match[0])
                replaceTextInDOM(dom, dom.window.document.body, rx, res.html)
            })
            .catch()
        }
    }

    if(options.imgFile){
        var imgFileLinks = html.matchAll(/https:\/\/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/ig)
        for (const match of imgFileLinks) {
            let rx = new RegExp(match[0])
            replaceTextInDOM(dom, dom.window.document.body, rx, `<img src="${match[0]}"/>`)
        }
    }

    return dom.serialize()
    return html
}