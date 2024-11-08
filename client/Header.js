import { Component, Style } from "@codeonlyjs/core";
import { makeIcon } from "./Icon.js";

// The main header
export class Header extends Component
{
    onMount()
    {
        stylish.addEventListener("darkModeChanged", this.invalidate);
    }

    onUnmount()
    {
        stylish.removeEventListener("darkModeChanged", this.invalidate);
    }

    loggedIn = false;

    static template = {
        _: "header",
        id: "header",
        $: [
            {
                _: "a",
                class: "title",
                attr_href: "/",
                $: [
                    { 
                        type: "img", 
                        class: "hide-sm",
                        attr_src: c => `/codeonly-logo-${stylish.darkMode ? "dark" : "light"}.svg`,
                    },
                    { 
                        type: "img", 
                        class: "hide-lg",
                        attr_src: c => `/codeonly-icon.svg`,
                    },
                ]
            },
            {
                _: "div",
                class: "buttons",
                $: [
                    {
                        if: c => c.loggedIn,
                        type: "a",
                        class: "subtle button",
                        attr_href: "/guide/",
                        text: "Docs",
                    },
                    {
                        if: c => c.loggedIn,
                        type: "a",
                        class: "subtle button labLink vcenter",
                        attr_href: "/lab",
                        $: [
                            makeIcon("science", 19),
                            " The Lab",
                        ]
                    },
                    {
                        type: "input",
                        attr_type: "checkbox",
                        attr_checked: window.stylish.darkMode ? "checked" : undefined,
                        class: "theme-switch",
                        on_click: () => window.stylish.toggleTheme(),
                    },
                ]
            }
        ]
    }
}

Style.declare(`
:root
{
    --header-height: 50px;
}

#header
{
    position: fixed;
    top: 0;
    width: 100%;
    height: var(--header-height);

    display: flex;
    justify-content: start;
    align-items: center;
    border-bottom: 1px solid var(--gridline-color);
    padding-left: 10px;
    padding-right: 10px;
    background-color: rgb(from var(--back-color) r g b / 50%);
    z-index: 1;

    .title 
    {
        flex-grow: 1;
        display: flex;
        align-items: center;
        color: var(--body-fore-color);
        transition: opacity 0.2s;

        &:hover
        {
            opacity: 75%;
        }

        img
        {
            height: calc(var(--header-height) - 25px);
            padding-right: 10px
        }
    }


    .buttons
    {
        font-size: 12pt;
        display: flex;
        gap: 10px;
        align-items: center;

        .theme-switch
        {
            transform: translateY(-1.5px);
        }
    }

    .lablink
    {
        svg 
        { 
            transform: translateY(-1px) scale(1.1);
            margin-right: 2px;
        };
    }

    .hide-lg
    {
        display: none;
    }
}

@media screen and (width < 550px) 
{
    #header
    {
        .hide-lg
        {
            display: block;
        }
        .hide-sm
        {
            display: none;
        }
    }
}

`);