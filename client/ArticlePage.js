import { Component, Style, Html, nextFrame } from "@codeonlyjs/core";
import { router } from "./router.js";
import { Document } from "./Document.js";
import { LayoutDocumentation } from "./LayoutDocumentation.js";
import { LayoutBare } from "./LayoutBare.js";
import { NotFoundPage } from "./NotFoundPage.js";

// The main header
export class ArticlePage extends Component
{
    constructor(document)
    {
        super();
        this.#document = document;
    }

    #document;
    get document()
    {
        return this.#document;
    }
    set document(value)
    {
        this.#document = value;
        this.invalidate();
    }

    get inPageLinks()
    {
        return this.document.headings;
    }

    get layout()
    {
        switch (this.document?.frontmatter?.layout)
        {
            case "bare":
                return LayoutBare;
            default:
                return LayoutDocumentation;
        }
    }

    onMount()
    {
        nextFrame(() => {
            this.document.mountDemos();
        });
    }

    onUnmount()
    {
        this.document.unmountDemos();
    }

    static template = {
        type: "div",
        class: "article",
        $: c => Html.raw(c.document?.html ?? "")
    }
}

Style.declare(`
.article
{
    padding: 10px 30px;
    margin: 0;
    margin-top: var(--align-content);

    span.note
    {
        color: var(--info-color);
        font-family: var(--font-family);
        font-size: 0.8rem;

        &:before
        {
            content: " ⓘ ";
            font-size: 1rem;
        }

        .inner
        {
            opacity: 0;
            background-color: #80808040;
            border-radius: 5px;
            padding: 2px 2px;
            color: var(--body-fore-color);
            transition: opacity 0.2s linear;
        }

        &:hover
        {
            .inner
            {
                visibility: visible;
                opacity: 1;
            }
        }

    }


    h1
    {
        margin-top: 0;
    }

    .hljs 
    {
        background-color: rgb(from var(--fore-color) r g b / 2%);
        font-size: 0.9rem;
        margin-bottom: 50px;
    }

    h2::before
    {
        content: " ";
        display: block;
        height: 5rem; 
        margin-top: -5rem;
    }

    a.hlink
    {
        float: left;
        margin-left: -1.2rem;
        opacity: 0;
        transition: opacity .2s;
    }

    h2:hover
    {
        a.hlink
        {
            opacity: 1;
        }
    }

    div.demo-header
    {
        display: flex;
        justify-content: space-between;
    }

    div.demo
    {
        background-color: rgb(from var(--fore-color) r g b / 2%);
        padding: 10px;
    }

    div.tip
    {
        margin: 30px 10px;
        font-size: 0.9rem;
        border: 1px solid var(--info-color);
        border-radius: 10px;
        padding: 10px 10px 0px 40px;

        &:before
        {
            content: " ⓘ ";
            float: left;
            margin-left: -25px;
            color: var(--info-color);
        }

        h3
        {
            font-size: 1rem;
            margin: 0;
        }

        p
        {
            margin: 0;
            margin-bottom: 10px;
        }
    }

    .box-container
    {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    }

    a.box
    {
        display: block;
        width: 30%;
        min-width: 200px;
        border: 1px solid var(--gridline-color);
        padding: 10px 10px 0 10px;
        border-radius: 10px;
        color: var(--body-fore-color);
        transition: background-color 0.2s;
        font-size: 0.8rem;
        text-align: center;

        &:hover
        {
            background-color: rgb(from var(--accent-color) r g b / 10%);
        }

        h3
        {
            margin: 0;
            font-size: 0.9rem;
            color: var(--link-color);
        }
    }
}

@media screen and (width < 550px) 
{
    .article
    {
        a.box
        {
            display: block;
            width: 40%;
        }
    }
}

@media screen and (width < 550px) 
{
    .article
    {
        a.box
        {
            display: block;
            width: 100%;
        }
    }
}


`);



router.register({
    pattern: "/:pathname*",
    match: async (to) => {
        try
        {
            to.document = new Document();
            await to.document.load(to.match.groups.pathname);
            to.page = new ArticlePage(to.document);
            return true;
        }
        catch
        {
            to.page = new NotFoundPage();
        }
        return true;
    },
    order: 10,
});

