import { Component, Style } from "@codeonlyjs/core";
import { router } from "./router.js";

class MyLink extends Component
{
    #href = "#";
    get href() { return this.#href; }
    set href(value) { this.#href = value; this.invalidate() }

    #title = "link";
    get title() { return this.#title; }
    set title(value) { this.#title = value; this.invalidate() }

    on_click(ev)
    {
        ev.preventDefault();
        alert("Special link handling done here!");
    }

    static template = {
        type: "a",
        attr_href: c => c.href,
        on_click: (c, ev) => c.on_click(ev),
        $: {
            type: "embed-slot", /* i:  Special name "embed-slot" */
            bind: "content", /* i:  Make this slot available as a component property */
            placeholder: c => " " + c.title + " ", /* i:  Revert to text if no slot content */
        },
    };

    static slots = [ "content" ]; /* i:  Slot names need to be declared */
}

class Main extends Component
{
    static template = {
        type: "div",
        $: [
            { 
                type: MyLink, 
                href: "/", 
                content: {
                    type: "img",
                    src: "/codeonly-icon.svg",
                    width: 32,
                    height: 32,
                } 
            },
            { type: MyLink, href: "/profile", title: "Profile" },
        ]
    }
}

router.register({
    pattern: "/test",
    match: (to) => {
        to.page = new Main();
        return true;
    }
});
