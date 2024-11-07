import { Component, Style, Html } from "@codeonlyjs/core";
import { Header } from "./Header.js";
import { HeroPage } from "./HeroPage.js";
import { Register } from "./Register.js";

// Main 
class Main extends Component
{
    constructor()
    {
        super();

    }

    static template = {
        type: "div",
        id: "layoutRoot",
        $: [
            Header,
            HeroPage,
            Register,
        ]
    }
}


Style.declare(`
#layoutRoot
{
    padding-top: var(--header-height);
}
`);

// Main entry point, create Application and mount
export function main()
{
    new Main().mount("body");
}