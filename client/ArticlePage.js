import { Component } from "@codeonlyjs/core";
import { router } from "./router.js";
import { Document } from "./Document.js";
import { LayoutDocumentation } from "./LayoutDocumentation.js";
import { LayoutBare } from "./LayoutBare.js";
import { NotFoundPage } from "./NotFoundPage.js";
import { NextPreviousNavigation } from "./NextPreviousNavigation.js";
import { DocumentView } from "./DocumentView.js";

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

    get structure()
    {
        return this.document.structure;
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

    static template = [
        {
            type: DocumentView,
            document: c => c.document,
        },
        {
            type: NextPreviousNavigation,        
        },
    ]
}

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
            to.page = new NotFoundPage(to.url);
        }
        return true;
    },
    order: 10,
});

