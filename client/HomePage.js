import { Component, Style, Html } from "@codeonlyjs/core";
import { HeroPage } from "./landing/HeroPage.js";
import { homeDemo } from "./landing/Copy.js";
import { ArticlePage } from "./ArticlePage.js";
import { Document } from "./Document.js";

// Main 
export class HomePage extends Component
{
    constructor()
    {
        super();
        this.document = new Document();
        this.document.processMarkdown(homeDemo);
    }
    onMount()
    {
    }

    onUnmount()
    {
    }

    static template = [
        HeroPage,
        {
            type: "div",
            class: "homeDemo",
            $: {
                type: ArticlePage,
                document: c => c.document,
            }
        }
    ]
}


Style.declare(`
.homeDemo
{
    max-width: 700px;
    margin: -30px auto 0 auto;
    text-align: center;

    code
    {
        text-align: left;
    }
}
`);
