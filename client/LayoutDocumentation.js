import { Component, Style, transition } from "@codeonlyjs/core";
import { MobileBar } from "./MobileBar.js";
import { MainNavigation } from "./MainNavigation.js";
import { SecondaryNavigation } from "./SecondaryNavigation.js";
import { router } from "./router.js";
import { navigationContext } from "./NavigationContext.js";

// Main application
export class LayoutDocumentation extends Component
{
    constructor()
    {
        super();
        this.create();
        router.addEventListener("mayLeave", () => this.hidePanel());
    }

    loadRoute(route)
    {
        navigationContext.setDocUrl(route.url);
        this.page = route.page;
        this.invalidate();
    }

    activePanel = null;

    showPanel()
    {
        this.activePanel = "primary";
        this.invalidate();
    }
    showSecondaryPanel()
    {
        this.activePanel = "secondary";
        this.invalidate();
    }
    hidePanel()
    {
        this.activePanel = null;
        this.invalidate();
    }

    static template = {
        type: "div#layoutDocumentation",
        $: [
            {
                type: MobileBar,
                on_showPanel: c => c.showPanel(),
                on_showSecondaryPanel: c => c.showSecondaryPanel(),
            },
            {
                type: "div#div-wrapper",
                $: [
                    {
                        type: "div#backdrop",
                        class_active: transition(c => c.activePanel != null),
                        on_click: c => c.hidePanel(),
                    },
                    {
                        type: "div#div-lhs",
                        class_active: transition(c => c.activePanel == "primary"),
                        $: MainNavigation
                    },
                    {
                        type: "div#div-center",
                        $: {
                            type: "embed-slot",
                            content: c => c.page,
                        },
                    },
                    {
                        type: "div#div-rhs",
                        class_active: transition(c => c.activePanel == "secondary"),
                        $: {
                            type: SecondaryNavigation,
                            structure: c => c.page?.structure,
                            on_hidePopupNav: c => c.hidePanel(),
                        }
                    }

                ]
            }
        ]
    };
}

const maxContentWidth = 720;
const sidePanelWidth = 250;

Style.declare(`
:root
{
    --side-panel-width: ${sidePanelWidth}px;
    --max-content-width: ${maxContentWidth}px;
    --main-indent: calc((100% - (var(--max-content-width) + var(--side-panel-width) * 2)) / 2);
    --fixed-header-height: var(--header-height);
    --align-content: -1.3rem;

}

#mobile-bar
{
    position: fixed;
    width: 100%;
    height: var(--header-height);
    top: var(--header-height);
}

#div-wrapper
{
    width: 100%;
    height: 100% - var(--header-height);
}

#div-lhs
{
    position: fixed;
    top: var(--header-height);
    bottom: 0;
    margin-left: var(--main-indent);
    width: var(--side-panel-width);
    height: calc(100% - var(--header-height));
    background-color: var(--body-back-color);
    z-index: 1;
}
#div-center
{
    position: relative;
    padding-top: var(--header-height);
    margin-left: calc(var(--side-panel-width) + var(--main-indent));
    margin-right: calc(var(--side-panel-width) + var(--main-indent));
}
#div-rhs
{
    position: fixed;
    top: var(--header-height);
    right: 0;
    bottom: 0;
    width: var(--side-panel-width);
    margin-right: var(--main-indent);

    overflow: auto;
    &::-webkit-scrollbar {
        width: 0px;
        background: transparent; /* make scrollbar transparent */
    }
}


#backdrop
{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(from var(--back-color) r g b / 75%);
    display: none;
    z-index: 1;
}


@media screen and (width < ${sidePanelWidth*2 + maxContentWidth + 25}px) 
{
    body
    {
        --main-indent: calc((100% - (var(--max-content-width) + var(--side-panel-width))) / 2);
    }

    #div-rhs
    {
         display: none;
    }

    #div-center
    {
        width: var(--max-content-width);
    }
}

@media screen and (width < ${sidePanelWidth + maxContentWidth + 25}px) 
{
    :root
    {
        --fixed-header-height: 0;
        --align-content: 0;
    }
    main
    {
        padding: 10px 40px;
    }
    #header
    {
        position: relative;
        height: var(--header-height);
    }
    #mobile-bar
    {
        position: relative;
    }

    #div-lhs
    {
         display: none;
    }
    #div-rhs
    {
    }
    #div-center
    {
        padding-top: 0;
        width: unset;
        max-width: var(--max-content-width);
        margin: 0 auto;
    }
    #mobile-bar
    {
        position: sticky;
        top: 0;
        display: flex;
    }

    body.show-side-panel
    {
    }


    #backdrop,
    #div-lhs,
    #div-rhs
    {
        transition: opacity 0.25s ease-out, transform 0.25s ease-out;
    }

    #backdrop.active
    {
        display: block;
        opacity: 1;

        &.tx-enter-start,
        &.tx-leave-end
        {
            opacity: 0;
        }
    }   

    #div-lhs.active
    {
        display: unset;
        margin-left: 0;
        top: 0;
        bottom: 0;
        height: 100%;
        z-index: 100;

        &.tx-enter-start,
        &.tx-leave-end
        {
            transform: translateX(calc(var(--side-panel-width) * -1));
            opacity: 0;
        }
    }

    #div-rhs.active
    {
        display: flex;
        align-items: stretch;
        top: calc(var(--header-height) * 2 + 1rem);
        left: 15%;
        right: 15%;
        width: 70%;
        height: unset;
        bottom: unset;
        background-color: var(--body-back-color);
        border: 1px solid var(--accent-color);
        border-radius: 0.5rem;
        z-index: 100;
        overflow: hidden;

        nav
        {
            flex-grow: 1;
            position: relative;
            max-height: 50vh;
            overflow: auto;
            padding: 1rem;
        }

        &.tx-enter-start,
        &.tx-leave-end
        {
            transform: translateY(-20px);
            opacity: 0;
        }
    }




    #layoutDocumentation.show-secondary-panel
    {
        &.show-secondary-panel-enter,
        &.show-secondary-panel-leave
        {
            #backdrop,
            #div-rhs
            {
                transition: 0.2s ease-out;
            }
        }

        &.show-secondary-panel-start-enter
        {
            #div-rhs
            {
                transform: translateY(-20px);
                opacity: 0;
            }
            #backdrop
            {
                opacity: 0;
            }
        }

        &.show-secondary-panel-leave
        {
            #div-rhs
            {
                transform: translateY(-20px);
                opacity: 0;
            }
            #backdrop
            {
                opacity: 0;
            }
        }
    }

    #layoutDocumentation.show-side-panel
    {
        #backdrop
        {
            display: block;
            opacity: 1;
        }

        &.show-side-panel-enter,
        &.show-side-panel-leave
        {
            #backdrop,
            #div-lhs
            {
                transition: 0.2s ease-in;
            }
        }

        &.show-side-panel-start-enter
        {
            #div-lhs
            {
                transform: translateX(calc(var(--side-panel-width) * -1));
            }
            #backdrop
            {
                opacity: 0;
            }

        }

        &.show-side-panel-leave
        {
            #div-lhs
            {
                transform: translateX(calc(var(--side-panel-width) * -1));
            }
            #backdrop
            {
                opacity: 0;
            }
        }
    }

}



`);
