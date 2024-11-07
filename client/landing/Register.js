import { Component, Style, Html } from "@codeonlyjs/core";

// The main header
export class Register extends Component
{
    registered = false;

    onSubmit(ev)
    {
        this.registered = true;
        this.invalidate();
        ev.preventDefault();
    }

    static template = {
        type: "div",
        class: "register",
        $: [
            {
                if: c => !c.registered,
                type: "form",
                id: "form",
                on_submit: (c,ev) => c.onSubmit(ev),
                $: [
                    Html.p("Coming Soon. Register to get early access..."),
                    {
                        type: "input",
                        bind: "email",
                        id: "email",
                        attr_type: "text",
                        attr_placeholder: "joe-the-coder@sixpack.com",
                    }
                ]
            },
            {
                else: true,
                type: "div",
                id: "thanks",
                text: "Thanks, we'll be in touch!",
            },
        ]
    }
}

Style.declare(`
.register
{
    margin-top: 40px;
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    p
    {
        margin: 10px;
    }


    #email
    {
        width: 400px;
        text-align: center;
        background-color: rgba(0, 0, 0, 20%);
    }
}
`);