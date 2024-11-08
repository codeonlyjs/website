var g=Object.defineProperty;var y=(i,t,e)=>t in i?g(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var o=(i,t,e)=>y(i,typeof t!="symbol"?t+"":t,e);import{C as d,S as l,t as u,H as p,a as f}from"./HeroPage-B9sXa1im.js";class m extends d{onMount(){stylish.addEventListener("darkModeChanged",this.invalidate)}onUnmount(){stylish.removeEventListener("darkModeChanged",this.invalidate)}}o(m,"template",{_:"header",id:"header",$:[{_:"a",class:"title",attr_href:"/",$:[{type:"img",attr_src:t=>`/codeonly-logo-${stylish.darkMode?"dark":"light"}.svg`}]},{_:"div",class:"buttons",$:[{type:"input",attr_type:"checkbox",attr_checked:window.stylish.darkMode?"checked":void 0,class:"theme-switch",on_click:()=>window.stylish.toggleTheme()}]}]});l.declare(`
:root
{
    --header-height: 50px;
}

#header
{
    position: fixed;
    top: 0;
    width: 100%;
    height: var(--header-height);

    display: flex;
    justify-content: start;
    align-items: center;
    border-bottom: 1px solid var(--gridline-color);
    padding-left: 10px;
    padding-right: 10px;
    background-color: rgb(from var(--back-color) r g b / 25%);
    z-index: 1;

    .title 
    {
        flex-grow: 1;
        display: flex;
        align-items: center;
        color: var(--body-fore-color);
        transition: opacity 0.2s;

        &:hover
        {
            opacity: 75%;
        }

        img
        {
            height: calc(var(--header-height) - 25px);
            padding-right: 10px
        }
    }


    .buttons
    {
        font-size: 12pt;
        display: flex;
        gap: 10px;
        align-items: center;
    }
}
`);class h extends d{constructor(){super(...arguments);o(this,"mode","unregistered");o(this,"message","");o(this,"submittedEmail")}async onSubmit(e){if(e.preventDefault(),this.mode=="unregistered"){this.submittedEmail=this.email.value,this.mode="",this.invalidate();let a=new Promise(r=>setTimeout(r,1e3));const n=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:this.submittedEmail})});n.ok||alert("Something went wrong, please try again later");let s=await n.json();await a,this.mode=s.mode,this.message=s.message,this.invalidate()}}async onSubmitOtp(e){e.preventDefault();let a=new Promise(r=>setTimeout(r,1e3)),s=await(await fetch("/api/otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:this.submittedEmail,otp:this.otp.value})})).json();s.redirect?(this.mode="",this.invalidate(),await a,window.location=s.redirect):(this.mode=s.mode,this.message=s.message,this.invalidate())}}o(h,"template",{type:"div",class:"register",$:[{if:u({value:e=>e.mode=="unregistered",mode:"leave-enter"}),type:"form",class:"page",on_submit:(e,a)=>e.onSubmit(a),$:{type:"div",$:[p.p("Coming Soon. Register to get early access..."),{type:"input",bind:"email",id:"register-em",attr_type:"email",attr_placeholder:"joe-the-coder@sixpack.com"}]}},{elseif:e=>e.mode=="otp",type:"form",class:"page",on_submit:(e,a)=>e.onSubmitOtp(a),$:{type:"div",$:[p.p("We've emailed you a one-time-password"),{type:"input",bind:"otp",id:"otp",attr_type:"text",attr_placeholder:"######"}]}},{elseif:e=>e.mode=="registered",type:"div",class:"page",id:"thanks",text:e=>e.message}]});l.declare(`
.register
{
    margin-top: 40px;
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
    }
}
`);class c extends d{constructor(){super()}}o(c,"template",{type:"div",id:"layoutRoot",$:[m,f,h]});l.declare(`
#layoutRoot
{
    padding-top: var(--header-height);
}
`);function v(){new c().mount("body")}v();
