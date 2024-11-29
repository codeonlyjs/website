import { Component, css, html } from "@codeonlyjs/core";
import { makeIcon } from "./Icon.js";

// The main header
export class Header extends Component
{
    constructor()
    {
        super();
        this.listen(coenv.window.stylish, "darkModeChanged");
    }

    loggedIn = false;

    static template = {
        type: "header#header",
        $: [
            {
                type: "a.title",
                href: "/",
                $: [
                    { 
                        type: "img.hide-sm",
                        src: c => `/public/codeonly-logo-${coenv.window?.stylish?.darkMode ? "dark" : "light"}.svg`,
                    },
                    { 
                        type: "img.hide-lg",
                        src: c => `/public/codeonly-icon.svg`,
                    },
                ]
            },
            {
                type: "div.buttons",
                $: [
                    {
                        if: c => c.loggedIn,
                        type: "a.subtle.button",
                        href: "/guide/",
                        text: "Docs",
                    },
                    {
                        if: c => c.loggedIn,
                        type: "a.subtle.button.labLink.vcenter",
                        href: "/lab",
                        $: [
                            makeIcon("science", 19),
                            " The Lab",
                        ]
                    },
                    {
                        type: "input type=checkbox .theme-switch",
                        on_click: () => window.stylish.toggleTheme(),
                    },
                    {
                        type: "script",
                        text: html(`document.querySelector(".theme-switch").checked = window.stylish.darkMode;`),
                    }                    
                ]
            }
        ]
    }
}

css`
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

`;