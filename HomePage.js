import { $, Component, router, css } from "@codeonlyjs/core";
import { HeroPage } from "./landing/HeroPage.js";

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


css`
.homePage
{
    text-align: center;
    margin-bottom: 50px;
}
`;


router.register({
    pattern: "/",
    match: (to) => {
        to.page = new HomePage();
        return true;
    }
});

