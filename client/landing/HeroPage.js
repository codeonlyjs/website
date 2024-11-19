import { $, Component, css } from "@codeonlyjs/core";
import { homeDemo, featureBoxes, featureBullets, codeOnlyBullets, reactivityBullets, learnBullets } from "./Copy.js";
import { Document } from "../Document.js";
import { DocumentView } from "../DocumentView.js";
import { makeIcon } from "../Icon.js";


// Main 
export class HeroPage extends Component
{
    constructor()
    {
        super();
        this.document = new Document();
        this.document.enableHeadingLinks = false;
        this.document.processMarkdown(homeDemo);
    }

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
                src: c => `/hero-${stylish.darkMode ? "dark" : "light"}.svg`,
            },
            $.h2.text("The front-end Web framework for coders."),
            {
                type: "div.row",
                $: featureBoxes.map(x => this.makeFeatureBox(x))
            },

            $.div.class("heading-graphic")(makeIcon("codeonly", 50)),
            $.h2.text("What is Code Only Development?"),
            $.p.text("An approach to front-end development where everything is written in clean, modern JavaScript."),
            codeOnlyBullets.map(x => ({
                type: "span.featureBullet",
                text: x
            })),

            $.div.class("heading-graphic")(makeIcon("box", 50)),
            $.h2.text("What's in the Box?"),
            $.p.text("Everything you need to build simple widgets or fully functional single page apps."),
            featureBullets.map(x => ({
                type: "span.featureBullet",
                text: x
            })),

            $.div.class("heading-graphic")(makeIcon("nonreactive", 50)),
            $.h2.text("Non-Reactive and Non-Intrusive"),
            $.p.text("Reactivity is great and all, but it can be intrusive.  We've taken a different path."),
            reactivityBullets.map(x => ({
                type: "span.featureBullet",
                text: x
            })),

            $.div.class("heading-graphic")(makeIcon("school", 50)),
            $.h2.text("Easy to Learn"),
            $.p.text("Learn the most important topics in just one afternoon, get started in no time..."),
            learnBullets.map(x => ({
                type: "span.featureBullet",
                text: x
            })),




            $.div.class("heading-graphic")(makeIcon("file", 50)),
            $.h2.text("Self-Contained Components"),
            $.p.text("Logic, Templates and Styles all in self contained .js files."),
            {
                type: DocumentView,
                document: c => c.document,
            }
        ]
    }

    static makeFeatureBox(x)
    {
        return {
            type: "div",
            class: "box",
            $: [
                $.h3(x.title),
                $.p($.html(x.body)),
            ]   
        }
    }

}    

css`
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

    hr
    {
        margin: 60px 0;
    }

    .heading-graphic
    {
        color: var(--accent-color);
        margin: 80px 0 20px 0;
    }

    .row
    {
        display: flex;
        gap: 10px;
        margin-top: 40px;
        margin-bottom: 40px;

        .box
        {
            cursor: default;
            border: 1px solid var(--gridline-color);
            border-radius: 7px;
            width: 33%;
            font-size: 0.75rem;
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

    span.featureBullet
    {
        font-size: 0.9rem;
        display: inline-block;
        white-space: nowrap;
        &:before
        {
            content: "✓ ";
            color: var(--accent-color);
        }
        margin-left: 10px;
        margin-right: 10px;
    }

    code
    {
        text-align: left;
    }
    .document-view
    {
        margin: 0 auto;
        max-width:700px;
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

`;
