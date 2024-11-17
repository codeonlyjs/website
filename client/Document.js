import { Component } from "@codeonlyjs/core";
import { env } from "@codeonlyjs/core";;
import { openLabWithCode } from "./lab/LabPage.js";
import { htmlIcon } from "./Icon.js";
import * as commonmark from "commonmark";
import { findMainClass } from "./lab/downloadScript.js";


export class Document
{
    constructor()
    {
    }

    enableHeadingLinks = true;
    
    load(pathname)
    {
        return env.load(async () => {

            // Work out "index" filename
            if (pathname == "" || pathname.endsWith("/"))
                pathname += "index";
    
            // Fetch the page
            const response = await fetch(`/content/${pathname}.md`);
            if (!response.ok)
                throw new Error(`Response status: ${response.status} - ${response.statusText}`);
    
            // Process markdown body
            this.processMarkdown( await response.text());

        });
    }

    mountDemos()
    {
        let styles = "";
        let fakeStyle = {
            declare(style)
            {
                styles += "\n" + style;
            }
        }

        for (let d of this.demos)
        {
            // Create a closure for the demo
            let code = `${d.code}\n\nreturn new ${findMainClass(d.code)}();`;
            let closure = new Function("Component", "Style", code);
            d.main = closure(Component, fakeStyle);
            d.main.mount(document.getElementById(d.id));

            if (d.isLab)
            {
                document.getElementById(`edit-${d.id}`).addEventListener("click", (ev) => {
                    openLabWithCode(d.code);
                    ev.preventDefault();
                });
            }
        }

        this.elStyles = document.createElement("style");
        this.elStyles.innerHTML = styles;
        document.head.appendChild(this.elStyles);
    }

    unmountDemos()
    {
        for (let d of this.demos)
        {
            d.main.unmount();
        }
        this.elStyles.remove();
    }

    processMarkdown(markdown)
    {
        // Store markdown (without frontmatter)
        this.frontmatter = {};
        markdown = markdown.replace(/\r\n/g, "\n");
        this.markdown = markdown.replace(/^---([\s\S]*?)---\n/, (m, m1) => {
            
            for (let line of m1.matchAll(/^([a-zA-Z0-9_]+):\s*(\"?.*\"?)\s*?$/gm))
            {
                try
                {
                    this.frontmatter[line[1]] = JSON.parse(line[2]);
                }
                catch
                {
                    this.frontmatter[line[1]] = line[2];
                }
            }
            return "";
        });

        // Parse it
        let parser = new commonmark.Parser();
        this.ast = parser.parse(this.markdown);

        // Find all h2s
        let walker = this.ast.walker();
        let ev;
        let currentHeading = null;
        let currentH2 = null;
        let headingText = "";
        this.structure = {
            headings: [],
            allHeadings: []
        };
        let codeBlocks = [];
        while (ev = walker.next())
        {
            // Entering a h2 or h3?
            if (ev.entering && ev.node.type === 'heading')
            {
                if (ev.node.level == 1 || ev.node.level == 2 || ev.node.level == 3)
                {
                    currentHeading = ev.node;
                }
            }

            // Capture heading text
            if (currentHeading != null && (ev.node.type === 'text' || ev.node.type === 'code'))
            {
                headingText += ev.node.literal;
            }

            // Exiting heading?
            if (!ev.entering && ev.node == currentHeading)
            {
                if (ev.node.level == 1)
                {
                    this.structure.title = headingText;
                    headingText = "";
                    currentHeading = null;
                    continue;
                }

                // Convert heading text to an id and build a 
                // heirarchy of headings/sub-headings for
                // the side panel
                let id = convertHeadingTextToId(headingText);
                if (id.length > 0)
                {
                    // Create a heading
                    let heading = {
                        node: ev.node,
                        text: headingText,
                        id,
                    };
                    this.structure.allHeadings.push(heading);

                    // Construct heirarchy
                    if (ev.node.level == 2)
                    {
                        this.structure.headings.push(currentH2 = heading);
                    }
                    else if (currentH2)
                    {
                        if (!currentH2.subHeadings)
                            currentH2.subHeadings = [];
                        currentH2.subHeadings.push(heading);
                        heading.id = `${currentH2.id}-${heading.id}`;
                    }
                    currentHeading = false;
                }

                // Reset for next heading
                headingText = "";
                currentHeading = null;
            }

            // Remember code blocks - we'll highlight them later
            if (ev.entering && ev.node.type == 'code_block')
            {
                codeBlocks.push(ev.node);
            }
        }

        // Insert the "#" links on all id headings
        if (this.enableHeadingLinks)
        {
            for (let h of this.structure.allHeadings)
            {
                let n = new commonmark.Node("html_inline", h.node.sourcepos);
                n.literal = `<a class="hlink" href="#${h.id}">#</a>`;
                h.node.prependChild(n);
            }
        }

        // Highlight code blocks
        this.demos = [];
        for (let cb of codeBlocks)
        {
            // Only javascript blocks
            if (cb.info != 'js' && cb.info != 'html' && cb.info != 'css')
                continue;
            
            // Get the code
            let code = cb.literal;

            // Strip off the demo marker if present
            let dir = code.match(/^\/\/(?:\s*\b(?:demo|code|lab)\b)+\n/);
            let isDemo = dir?.[0].indexOf("demo") >= 0;
            let isCode = dir?.[0].indexOf("code") >= 0;
            let isLab = dir?.[0].indexOf("lab") >= 0;
            if (dir)
            {
                code = code.substring(dir[0].length);
            }
            else
            {
                isCode = true;
            }

            let originalCode = code;

            // Pull out Style.declare() blocks
            let cssBlocks = [];
            code = code.replace(/Style\.declare\(`([^`]*)`\)/g, (m, css) => {
                cssBlocks.push(css);
                return `Style.declare("-- style block ${cssBlocks.length} --")`
            });

            // Pull out snipped sections
            code = code.replace(/(?:^|(?<=\n))\/\/ ---\n[\s\S]*?\/\/ ---\n/g, (m, code) => {
                return `/* -- snip -- */`;
            });

            // Highlight the code
            let html = hljs.highlight(code, { 
                language: cb.info, 
                ignoreIllegals: true
            });

            // Highlight nested CSS blocks
            for (let i=0; i<cssBlocks.length; i++)
            {
                let css = hljs.highlight(cssBlocks[i], {
                    language: 'css', 
                    ignoreIllegals: true
                });

                let declare = `\`${css.value}\``;

                html.value = html.value.replace(`&quot;-- style block ${i+1} --&quot;`, declare);
            }

            // Convert info-tip comments
            html.value = html.value.replace(
                /<span class="hljs-comment">\/\* i: ([\s\S]*?)\*\/<\/span>/g, 
                `<span class="note"><span class="inner">$1</span></span>`
            );

            // Convert snipped blocks comments
            html.value = html.value.replace(
                /<span class="hljs-comment">\/\* -- snip -- \*\/<\/span>/g, 
                `<div class="snip" title="Some code omitted for clarity."><span class="hline"></span>${htmlIcon("scissors", 16)}<span class="hline"></span></div>`
            );

            // Wrap code block
            let wrapper_html = "";
            if (isCode)
                wrapper_html += `<pre><code class="hljs language-${html.language}">${html.value}</code></pre>\n`;

            // If it's a demo
            if (isDemo || isLab)
            {  
                // Remove C style comments
                originalCode = originalCode.replace(/\s\/\*.*\*\//g, "");

                // Remove snip mapers
                originalCode = originalCode.replace(/(?:^|(?<=\n))\/\/ ---\n/g, "");

                // Insert thte demo block
                let id = `demo-${this.demos.length}`
                this.demos.push({ id, code: originalCode, isLab });
                if (isLab)
                {
                    wrapper_html += `
<div class="demo-header">
    <span></span>
    <a id="edit-${id}" class="edit-demo-link vcenter" href="#">${htmlIcon("science", 22)}<span> Edit</span></a>
</div>
`
                }

                if (isDemo)
                {
                    if (!isLab)
                    {
                        wrapper_html += `
<div class="demo-header">
    <span></span>
</div>
`
                    }

                    wrapper_html += `
<div id="${id}" class="demo">
</div>
`;
                }
            }

            // Update markdown AST with the new raw HTML block
            let html_block = new commonmark.Node("html_block", cb.sourcepos);
            html_block.literal = wrapper_html;
            cb.insertBefore(html_block);
            cb.unlink();
        }

        // Render final HTML
        let renderer = new commonmark.HtmlRenderer();
        let oldAttrs = renderer.attrs;
        renderer.attrs = (node) =>
        {
            let att = oldAttrs.call(renderer, ...arguments);
            if (node.type == "heading" && (node.level == 2 || node.level == 3))
            {
                let heading = this.structure.allHeadings.find(x => x.node == node);
                if (heading)
                {
                    att.push(["id", heading.id]);
                }
            }
            return att;
        }
        this.html = renderer.render(this.ast);
    }
}

function convertHeadingTextToId(text)
{
    // Lower case
    text = text.toLowerCase();

    // Remove async prefix
    text = text.replace(/^async /, "");
    
    // Remove method parameters
    text = text.replace(/\b\(.*?\)/g, "");

    // Convert all non-letter-digits to hyphens
    text = text.replace(/[^\p{L}\p{N}]+/gu, "-");

    // Get rid of duplicate hypens
    text = text.replace(/-+/, "-");

    // Get rid if leading/trailing hypens
    text = text.replace(/^-|-$/g, "");
    return text;
}
