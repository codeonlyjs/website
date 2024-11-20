import { $, Component, css, transition } from "@codeonlyjs/core";

// The main header
export class Register extends Component
{
    mode = "unregistered";
    message = "";
    submittedEmail;

    async onSubmit(ev)
    {
        ev.preventDefault();
        if (this.mode == "unregistered")
        {
            this.submittedEmail = this.email.value;

            this.mode = "";
            this.invalidate();

            let pause = new Promise((r) => setTimeout(r, 1000));

            // Fetch the page
            const response = await fetch(`/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: this.submittedEmail,
                })
            });

            if (!response.ok)
            {
                alert("Something went wrong, please try again later");
            }


            let json = await response.json();

            await pause;

            this.mode = json.mode;
            this.message = json.message;
            this.invalidate();
        }
    
    }

    async onSubmitOtp(ev)
    {   
        ev.preventDefault();

        let pause = new Promise((r) => setTimeout(r, 1000));

        const response = await fetch(`/api/otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.submittedEmail,
                otp: this.otp.value,
            })
        });

        let json = await response.json();

        if (json.redirect)
        {
            this.mode = "";
            this.invalidate();
            await pause;
            window.location = json.redirect;
        }
        else
        {
            this.mode = json.mode;
            this.message = json.message;
            this.invalidate();
        }
    }

    static template = {
        type: "div",
        class: "register",
        $: [
            {
                //if: c => c.mode == "unregistered",
                if: transition({
                    value: c => c.mode == "unregistered",
                    mode: "leave-enter",
                }),
                type: "form",
                class: "page",
                on_submit: (c,ev) => c.onSubmit(ev),
                $: {
                    type: "div",
                    $: [
                        $.p("Coming Soon. Register to get early access..."),
                        {
                            type: "input",
                            bind: "email",
                            id: "register-em",
                            attr_type: "email",
                            attr_placeholder: "joe-the-coder@sixpack.com",
                        }
                    ]
                }
            },
            {
                elseif: c => c.mode == "otp",
                type: "form",
                class: "page",
                on_submit: (c,ev) => c.onSubmitOtp(ev),
                $: {
                    type: "div",
                    $: [
                        $.p("We've emailed you a one-time-password"),
                        {
                            type: "input",
                            bind: "otp",
                            id: "otp",
                            attr_type: "text",
                            attr_placeholder: "######",
                        }
                    ]
                }
            },
            {
                elseif: c => c.mode == "registered",
                type: "div",
                class: "page",
                id: "thanks",
                text: c => c.message,
            },
        ]
    }
}

css`
.register
{
    margin-top: 40px;
    margin-bottom: 40px;
    width: 100%;
    height: 100px;
    position: relative;

    .page
    {
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 1s, transform 1s;
    }

    form
    {
        text-align: center;
    }

    #thanks
    {
        font-size: 1.5rem;
        text-align: center;
    }

    form.page.tx-entering,
    #thanks.page.tx-entering
    {
        transition: transform 1s  linear(
            0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141 13.6%, 0.25, 0.391, 0.563, 0.765,
            1, 0.891 40.9%, 0.848, 0.813, 0.785, 0.766, 0.754, 0.75, 0.754, 0.766, 0.785,
            0.813, 0.848, 0.891 68.2%, 1 72.7%, 0.973, 0.953, 0.941, 0.938, 0.941, 0.953,
            0.973, 1, 0.988, 0.984, 0.988, 1
        );
    }
    
    .tx-enter-start,
    .tx-leave-end
    {
        opacity: 0;
        transform: scale(0);
    }

    #register-em,
    #otp
    {
        text-align: center;
        background-color: rgba(0, 0, 0, 20%);
    }
    
    #register-em
    {
        width: 400px;
        max-width: 80%;
    }
}
`;