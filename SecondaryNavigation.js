import { Component, css, DocumentScrollPosition } from "@codeonlyjs/core";


// The main header
export class SecondaryNavigation extends Component
{
    constructor()
    {
        super();
        this.listen(coenv.document, "scroll", () => {
            this.positionHighlight();
        });
    }

    #structure;
    get structure()
    {
        return this.#structure;
    }
    set structure(value)
    {
        this.#structure = value;
        this.#headingCoords = null;
        this.#highlightId = null;
        this.invalidate();
        this.positionHighlight();
    }
    
    hidePopupNav()
    {
        this.dispatchEvent(new Event("hidePopupNav"));
    }

    #headingCoords = null;
    #oldHeight;
    #highlightId;

    positionHighlight()
    {
        if (!this.#structure)
            return;

        if (!coenv.browser)
            return;

        let doc = coenv.document;

        // If the document scroll height changed, discard the old
        // heading coords and recalculate
        if (!this.#oldHeight || this.#oldHeight != doc.body.scrollHeight)
        {
            this.#oldHeight = doc.body.scrollHeight;
            this.#headingCoords = null;
        }

        // Calculate heading coords
        let scrollPos = DocumentScrollPosition.get().top;
        if (this.#headingCoords == null)
        {
            this.#headingCoords = this.#structure.allHeadings.map(x => {
                let el = doc.getElementById(x.id);
                let bounds = el.getBoundingClientRect();
                return {
                    id: x.id,
                    top: bounds.top + scrollPos,
                }
            });
        }

        // Find the first heading that's visible
        let highlightId = "";
        if (scrollPos > 20)
        {
            let vh = window.innerHeight || 0;
            scrollPos += 150;
            for (let hc of this.#headingCoords)
            {
                if (hc.top > scrollPos)
                    break;
                highlightId = hc.id;
            }
        }

        // Quit if correct item already highlighted
        if (highlightId == this.#highlightId)
            return;
        this.#highlightId = highlightId;
        
        // Find the item
        let link = this.domTree.rootNode.querySelector(`a[href='#${highlightId}']`);
        if (link)
        {
            let rThis = this.domTree.rootNode.getBoundingClientRect();
            let r = link.getBoundingClientRect();
            this.highlight.style.top = r.top - rThis.top - 2;
            this.highlight.style.height = r.height + 4;
            link.scrollIntoViewIfNeeded?.(false);
        }
    }

    update()
    {
        super.update();
        this.positionHighlight();
    }

    static template = {
        type: "nav",
        id: "secondary-nav",
        on_click: c => c.hidePopupNav(),
        $: [
            {
                type: "div .highlight",
                bind: "highlight",
            },
            {
                if: c => c.structure?.headings?.length > 0,
                $: {
                    type: "a .title",
                    href: "#",
                    text: c => c.structure.title ?? "On This Page",
                }
            },
            {
                type: "ul .h1",
                $: {
                    foreach: c => c.structure?.headings,
                    type: "li",
                    $: [
                        {
                            type: "a",
                            href: i => `#${i.id}`,
                            text: i => i.text,
                        },
                        {
                            if: i => i.subHeadings,
                            type: "ul .h2",
                            $: {
                                foreach: i => i.subHeadings,
                                type: "li",
                                $: [
                                    {
                                        type: "a",
                                        href: i => `#${i.id}`,
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

css`
#secondary-nav
{
    padding: 1rem;

    div.highlight
    {
        background-color: var(--accent-color);
        position: absolute;
        width: 2px;
        left: 7px;
        top: 45px;
        height: 31px;
        border-radius:1px;
        transition: top 0.5s cubic-bezier(0,1,.5,1) , height 0.5s cubic-bezier(0,1,.5,1);
    }

    a.title
    {
        display: block;
        margin-top: 1.6rem;
    }

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

`;