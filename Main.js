import { Component, css, router } from "@codeonlyjs/core";
import { Header } from "./Header.js";
import { HomePage } from "./HomePage.js";

import "./ArticlePage.js";
import "./lab/LabPage.js";
import "./NotFoundPage.js";

router.register({
    pattern: "/",
    match: (to) => {
        to.page = new HomePage();
        return true;
    }
});

router.register({
    pattern: "/logout",
    match: () => null
});



// Main 
export class Main extends Component
{
    constructor()
    {
        super();

        router.addEventListener("didEnter", (from, to) => {

            this.create();
            
            // Load navigated page into router slot
            if (to.page)
            {
                if (!to.page.layout)
                {
                    this.layoutSlot.content = to.page;
                    this.#currentLayout = null;
                }
                else
                {
                    // Different layout?
                    if (to.page.layout != this.#currentLayout?.constructor)
                    {
                        // Create new layout component
                        this.#currentLayout = new to.page.layout();
                        this.layoutSlot.content = this.#currentLayout;
                    }

                    this.#currentLayout.loadRoute(to);
                }
            }
        });
    }

    #currentLayout = null;

    static template = {
        type: "div",
        id: "layoutRoot",
        $: [
            {
                type: Header,
                loggedIn: true,
            },
            {
                type: "embed-slot",
                bind: "layoutSlot",
            }
        ]
    }
}

css`
#layoutRoot
{
    padding-top: var(--fixed-header-height);
}

.vcenter
{
    display: flex;
    align-items: center;
}

`;

// Main entry point, create Application and mount
export function main()
{
    new Main().mount("body");

    router.start();
}