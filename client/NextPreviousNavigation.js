import { Component, Style } from "@codeonlyjs/core";
import { navigationContext } from "./NavigationContext.js";

export class NextPreviousNavigation extends Component
{
    constructor()
    {
        super();
    }

    onMount()
    {
        this.listen(navigationContext, "ready", this.invalidate);
    }

    get next()
    {
        return navigationContext.next(1);
    }

    get previous()
    {
        return navigationContext.next(-1);
    }

    static template = {
        type: "nav",
        class: "next-previous-navigation",
        $: [
            this.link("previous", "‹ Previous"),
            this.link("next", "Next ›"),
        ]
    }

    static link(prop, title)
    {
        return [
            {
                if: c => !!c[prop],
                type: "a",
                class: prop,
                attr_href: c => c[prop].url,
                $: [
                    {
                        type: "div",
                        class: "description muted",
                        text: title,
                    },
                    {
                        type: "div",
                        class: "title",
                        text: c => c[prop].fullTitle,
                    },
                ]
            },
            {
                else: true,
                type: "div",
            }
        ];
    }
}

Style.declare(`
.next-previous-navigation
{
    border-top: 1px solid var(--gridline-color);
    padding-top: 15px;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    a
    {
        font-size: 0.9rem;
    }
    .next
    {
        text-align:right;
    }
    .description
    {
        font-size: 0.8rem;
        color: rgb(from var(--body-fore-color) r g b / 75%);
    }
}
`);