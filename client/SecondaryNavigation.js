import { Component, Style, Html } from "@codeonlyjs/core";


// The main header
export class SecondaryNavigation extends Component
{
    constructor()
    {
        super();
    }

    #inPageLinks;
    get inPageLinks()
    {
        return this.#inPageLinks;
    }
    set inPageLinks(value)
    {
        this.#inPageLinks = value;
        this.invalidate();
    }
    
    hidePopupNav()
    {
        this.dispatchEvent(new Event("hidePopupNav"));
    }


    static template = {
        type: "nav",
        id: "secondary-nav",
        on_click: c => c.hidePopupNav(),
        $: [
            {
                if: c => c.inPageLinks?.length > 0,
                $: Html.h(6, "On This Page"),
            },
            {
                type: "ul",
                class: "h1",
                $: {
                    foreach: c => c.inPageLinks,
                    type: "li",
                    $: [
                        {
                            type: "a",
                            attr_href: i => `#${i.id}`,
                            text: i => i.text,
                        },
                        {
                            if: i => i.subHeadings,
                            type: "ul",
                            class: "h2",
                            $: {
                                foreach: i => i.subHeadings,
                                type: "li",
                                $: [
                                    {
                                        type: "a",
                                        attr_href: i => `#${i.id}`,
                                        text: i => i.text,
                                    },
                                ]
                            }
                        }

                    ]
                }
            }
        ]
    }
}

Style.declare(`
#secondary-nav
{
    padding: 0rem 1rem 1rem 1rem;

    ul.h1
    {
        font-size: 0.8rem;
        li
        {
            padding-top: 0.5rem;
            line-height: 1.2rem;
        }
    }

    ul.h2
    {
        font-size: 0.8rem;
        li
        {
            padding-left: 1rem;
            padding-top: 0.2rem;
            line-height: 1rem;
        }
    }
}

`);