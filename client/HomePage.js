import { $, Component, Style, Html } from "@codeonlyjs/core";
import { HeroPage } from "./landing/HeroPage.js";
import { homeDemo } from "./landing/Copy.js";
import { DocumentView } from "./DocumentView.js";

// Main 
export class HomePage extends Component
{
    constructor()
    {
        super();
    }
    onMount()
    {
    }

    onUnmount()
    {
    }

    static template = [
        HeroPage,
        $.div.class("homePage")(
            $.a("Read the Guide ›").href("/guide/")
        )
    ]
}


Style.declare(`
.homePage
{
    text-align: center;
    margin-bottom: 50px;
}
`);
