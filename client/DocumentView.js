import { Component, css, html, nextFrame } from "@codeonlyjs/core";

export class DocumentView extends Component
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

    get structure()
    {
        return this.document.structure;
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

    static template = [
        {
            type: "div",
            class: "document-view",
            $: c => html(c.document?.html ?? ""),
        },
    ]
}

css`
.document-view
{
    padding: 10px 30px 50px 30px;
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

    h2::before,
    h3::before
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

    h3:hover,
    h2:hover
    {
        a.hlink
        {
            opacity: 1;
        }
    }

    div.demo-footer
    {
        display: flex;
        justify-content: space-between;
        margin: 10px 10px 60px 10px;
    }

    div.demo
    {
        margin: 0px 10px 0px 10px;
        background-color: rgb(from var(--fore-color) r g b / 2%);
        border-radius: 10px;
        padding: 10px;
        border: 1px solid var(--accent-color);
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

    div.snip
    {
        font-family: var(--font-family);
        font-size: 0.8rem;
        text-align: center;
        color: var(--gridline-color);

        span.hline
        {
            display: inline-block;
            margin: 0 8px;
            border-bottom: 1px solid var(--gridline-color);
            width: 30%;
            transform: translateY(-8px);
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

        h4
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


`;

