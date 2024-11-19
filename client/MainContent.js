import { Component, css } from "@codeonlyjs/core";

// The main header
export class MainContent extends Component
{
    constructor()
    {
        super();

    }
    
    static template = {
        type: "main",
        $: {
            type: "embed-slot",
            bind: "routerSlot",
        }
    }
}

css`
main
{
}

`;

