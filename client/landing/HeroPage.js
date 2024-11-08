import { Component, Style, Html } from "@codeonlyjs/core";
import { featureBoxes } from "./Copy.js";

// Main 
export class HeroPage extends Component
{
    onMount()
    {
        stylish.addEventListener("darkModeChanged", this.invalidate);
        document.documentElement.classList.add("home-colors");
    }

    onUnmount()
    {
        stylish.removeEventListener("darkModeChanged", this.invalidate);
        document.documentElement.classList.remove("home-colors");
    }

    static template = {
        type: "main",
        class: "hero",
        $: [
            {
                type: "img",
                id: "hero",
                attr_src: c => `/hero-${stylish.darkMode ? "dark" : "light"}.svg`,
            },
            {
                type: "h2",
                text: "The Web framework for coders.",
            },
            {
                type: "div",
                class: "row",
                $: featureBoxes.map(x => makeFeatureBox(x))
            },
        ]
    }
}

function makeFeatureBox(x)
{
    return {
        type: "div",
        class: "box",
        $: [
            Html.h(3, x.title),
            Html.p(Html.raw(x.body)),
        ]   
    }
}

Style.declare(`
main.hero
{
    text-align: center;
    position: relative;
    max-width: 960px;
    margin: 50px auto 20px auto;
    padding: 10px 40px;

    #hero
    {
        width: 100%;
        max-width: 800px;
        min-width: 300px;
        margin-top: -100px;
        margin-bottom: -10%;
        aspect-ratio: 3179 / 1611;
    }
    h2
    {
        margin: 0;
        font-size: 1.2rem;
    }

    .row
    {
        display: flex;
        gap: 10px;
        margin-top: 40px;

        .box
        {
            cursor: default;
            border: 1px solid var(--gridline-color);
            border-radius: 7px;
            width: 33%;
            font-size: 10pt;
            padding: 10px;
            color: var(--body-fore-color);
            transition: background-color 0.2s;
            margin: 5px 0;

            &:hover
            {
                background-color: rgb(from var(--accent-color) r g b / 10%);
            }

            h3
            {
                margin-top: 10px;
                font-size: 1rem;
                color: var(--accent-color);
            }
        }
    }

}

@media screen and (width < 550px) 
{
    main.hero
    {
        padding: 10px 20px;
        .row
        {
            display: block;
            text-align: center;
            .box
            {
                width: 100%;
                display: block;
                margin: 10px 0;
            }
        }
        h2
        {
            margin: 0;
            font-size: 1.0rem;
        }
    }
}

`);
