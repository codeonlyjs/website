import { Component, router, $ } from "@codeonlyjs/core";

function abs(url)
{
    if (!router.current)
        return "";
    return new URL(url, router.current.url).href;
}

export class Meta extends Component
{
    constructor()
    {
        super();

        router.addEventListener("didEnter", (from, to) => {
            this.invalidate();
            if (coenv.browser)
                document.title = this.title;
        });
    }

    get title()
    {
        if (router.current?.title)
            return `${router.current.title} - CodeOnlyJS`;
        else
            return "CodeOnlyJS";
    }

    get name()
    {
        return "CodeOnlyJS";
    }

    get description()
    {
        return "CodeOnlyHS - The Web framework for coders";
    }

    get url()
    {
        return router.current?.url.href ?? "";
    }

    get image()
    {
        return abs("/public/social-card-dark-1200.png");
    }

    get appleIcon()
    {
        return abs("/public/codeonly-icon-256.png");
    }


    static template = [

        // Standard
        $.title(c => c.title),
        $.meta.name("description").content(c => c.description),

        // Google/Search
        $.meta.itemprop("name").content(c => c.name),
        $.meta.itemprop("description").content(c => c.description),
        $.meta.itemprop("image").content(c => c.image),

        // Facebook
        $.meta.name("og:url").content(c => c.url),
        $.meta.name("og:type").content("website"),
        $.meta.name("og:title").content(c => c.title),
        $.meta.name("og:description").content(c => c.description),
        $.meta.name("og:image").content(c => c.image),

        // Twitter
        $.meta.name("twitter:card").content("summary_large_image"),
        $.meta.name("twitter:title").content(c => c.title),
        $.meta.name("twitter:description").content(c => c.description),
        $.meta.name("twitter:image").content(c => c.image),

        // Apple
        $.link.rel("apple-touch-icon").href(c => c.appleIcon),
        
    ]
}
