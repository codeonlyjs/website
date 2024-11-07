import { Component, Style, Html } from "@codeonlyjs/core";
import { featureBoxes } from "./Copy.js";

// Main 
export class HomePage extends Component
{
    static template = {
        type: "main",
        $: [
            {
                type: "img",
                id: "hero",
                attr_src: "/hero.svg",
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
main
{
    text-align: center;
    position: relative;
    max-width: 960px;
    margin: 50px auto;

    #hero
    {
        width: 100%;
        max-width: 800px;
        margin-top: -130px;
        margin-bottom: -100px;
    }
    h2
    {
        margin: 0;
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
    main
    {
        .row
        {
            display: block;
            .box
            {
                width: 90%;
                display: block;
                margin: 10px auto;
            }
        }
    }
}

`);
