import { $, Component, transition, css } from "@codeonlyjs/core";
import { router } from "./router.js";

class Main extends Component
{
    showIt = true;

    onClick()
    {
        this.showIt = !this.showIt;
        this.invalidate();
    }

    static template = {
        type: "div .transition-demo1",
        $: [
            {
                type: "button on_click=onClick text=Toggle",
            },
            " mode:",
            {
                type: "select",
                bind: "mode",
                $: [
                    $.option("concurrent"),
                    $.option("enter-leave"),
                    $.option("leave-enter")
                ]
            },
            $.hr,
            {
                type: "div .container",
                $: [
                    {
                        if: transition({
                            value: c => c.showIt,
                            mode: c => c.mode.value,
                        }),
                        type: "div .item .hello",
                        text: "Hello",

                    },
                    {
                        else: true,
                        type: "div .item .bye",
                        text: "Goodbye",
                    }
                ]
            }
        ]
    }
}

css`
.transition-demo1
{
    .container
    {
        height: 2.4rem;
        margin: 0;
        padding: 0;
        position: relative;
    }

    .item
    {
        border: 1px solid;
        border-radius: 5px;
        padding: 5px;
        width: 300px;
        text-align: center;
        position: absolute;

        &.tx-active
        {
            transition: opacity 1s, transform 1s;
        }

        &.tx-out
        {
            opacity: 0;
        }

        &.tx-enter-start
        {
            transform: translateY(50px);
        }

        &.tx-leave-end
        {
            transform: translateY(-50px);
        }
    }

    .hello 
    { 
        border-color: lime 
    }

    .bye
    { 
        border-color: orange
    }

}
`

router.register({
    pattern: "/test",
    match: (to) => {
        to.page = new Main();
        return true;
    }
});
