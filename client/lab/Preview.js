import { Component, Style } from "@codeonlyjs/core";
import { PreviewIFrame } from "./PreviewIFrame.js";

// The preview pane
export class Preview extends Component
{
    constructor()
    {
        super();
    }

    #script="";
    set script(value)
    {
        this.#script = value;
        this.invalidate();
    }
    get script()
    {  
        return this.#script;
    }

    // Helper to create a new iFrame component each time
    // the script changes
    createIframe()
    {
        if (this.#script === "")
            return null;
        // Create an iframe component for this script
        return new PreviewIFrame(this.#script);
    }

    static template = {
        type: "div",
        id: "preview",
        $: {
            type: "embed-slot",
            content: c => c.createIframe(),
        }
    }
}


Style.declare(`
#preview
{
    position: relative;
    flex-grow: 1;
    background: var(--body-back-color);
    iframe
    {
        width: 100%;
        height: 100%;
        border: none;
    }
}
`);

