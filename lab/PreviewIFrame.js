import { Component } from "@codeonlyjs/core";
import { findMainClass } from "./downloadScript.js";

// srcdoc for the iFrame
let head = `<html>
<head>
<script type="importmap">
{
    "imports": {
        "@codeonlyjs/core": "https://cdn.jsdelivr.net/gh/codeonlyjs/core@0.0.64/dist/codeonly.min.js"
    }
}
</script>
##stylesheets##
<script>
window.addEventListener("error", (ev) => {
    parent.postMessage({action: "error", error: { message: ev.message, lineno: ev.lineno - ##patchlinecount##, colno: ev.colno } });
})
</script>
</head>
<body>
<script type="module">
import { $, Component, css, html, htmlEncode, input, transition} from "@codeonlyjs/core";
`;

let tail = `
</script>
</body>
</html>
`;

// Copy importmap and stylesheets from main document into the iframe srcdoc
// Also, patch in a line number adjustment for the user's script so we get
// correct line numbers in error messages.
let fixed = false;
function fixup_template()
{
    if (fixed)
        return;
    fixed = true;

    /*
    // Copy import map from self
    let importmap = document.querySelector("script[type=importmap]");
    head = head.replace("##importmap##", importmap?.textContent ?? "");
    */

    let stylesheets = Array.from(document.querySelectorAll("link[rel=stylesheet]")).map(x => 
        `<link href="${x.getAttribute("href")}" rel="stylesheet">`).join("\n");
    head = head.replace("##stylesheets##", stylesheets);

    // Update the head part to adjust the line number on errors
    head = head.replace("##patchlinecount##", (head.split('\n').length - 1).toString());
}


// Preview iFrame component
export class PreviewIFrame extends Component
{
    constructor(script)
    {
        if (coenv.browser)
            fixup_template();

        super();
        this.script = script;
    }

    get srcdoc()
    {
        if (coenv.browser)
        {
            return `${head}${this.script}
            new ${findMainClass(this.script)}().mount("body");
            ${tail}
            `;
        }
        else
        {
            return "";
        }
    }

    static template = {
        type: "iframe",
        srcdoc: c => c.srcdoc,
    }
}

