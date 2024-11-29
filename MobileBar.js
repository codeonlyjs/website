import { Component, css } from "@codeonlyjs/core";

// The main header
export class MobileBar extends Component
{
    static template = {
        type: "header",
        id: "mobile-bar",
        $: [
            {
                type: "button .subtle .muted #side-panel-menu-button",
                on_click: c => c.dispatchEvent(new Event("showPanel")),
                $: [
                    {
                        type: "svg",
                        width: "20",
                        height: "20",
                        viewBox: "0 -960 960 960",
                        preserveAspectRatio: "xMidYMid slice",
                        role: "img",
                        $: {
                            type: "path",
                            d: "M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z",
                        }
                    },
                    " Menu"
                ]
            },
            {
                type: "button .subtle .muted #side-panel-menu-button",
                on_click: c => c.dispatchEvent(new Event("showSecondaryPanel")),
                text: "On this page ›"
            }
        ]
    }
}

css`
#mobile-bar
{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--gridline-color);
    padding-left: 10px;
    padding-right: 10px;
    background-color: rgb(from var(--back-color) r g b / 50%);
    z-index: 1;
    display: none;

}

#side-panel-menu-button
{
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    padding: 5px;

    svg
    {
        margin-right: 0.2rem;
    }
}
`;