var c=Object.defineProperty;var h=(i,t,e)=>t in i?c(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var o=(i,t,e)=>h(i,typeof t!="symbol"?t+"":t,e);import{C as p,t as u,H as m,S as d,c as y,b as f}from"./HeroPage-B_1CyEhA.js";class l extends p{constructor(){super(...arguments);o(this,"mode","unregistered");o(this,"message","");o(this,"submittedEmail")}async onSubmit(e){if(e.preventDefault(),this.mode=="unregistered"){this.submittedEmail=this.email.value,this.mode="",this.invalidate();let a=new Promise(r=>setTimeout(r,1e3));const n=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:this.submittedEmail})});n.ok||alert("Something went wrong, please try again later");let s=await n.json();await a,this.mode=s.mode,this.message=s.message,this.invalidate()}}async onSubmitOtp(e){e.preventDefault();let a=new Promise(r=>setTimeout(r,1e3)),s=await(await fetch("/api/otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:this.submittedEmail,otp:this.otp.value})})).json();s.redirect?(this.mode="",this.invalidate(),await a,window.location=s.redirect):(this.mode=s.mode,this.message=s.message,this.invalidate())}}o(l,"template",{type:"div",class:"register",$:[{if:u({value:e=>e.mode=="unregistered",mode:"leave-enter"}),type:"form",class:"page",on_submit:(e,a)=>e.onSubmit(a),$:{type:"div",$:[m.p("Coming Soon. Register to get early access..."),{type:"input",bind:"email",id:"register-em",attr_type:"email",attr_placeholder:"joe-the-coder@sixpack.com"}]}},{elseif:e=>e.mode=="otp",type:"form",class:"page",on_submit:(e,a)=>e.onSubmitOtp(a),$:{type:"div",$:[m.p("We've emailed you a one-time-password"),{type:"input",bind:"otp",id:"otp",attr_type:"text",attr_placeholder:"######"}]}},{elseif:e=>e.mode=="registered",type:"div",class:"page",id:"thanks",text:e=>e.message}]});d.declare(`
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
`);class g extends p{constructor(){super()}}o(g,"template",{type:"div",id:"layoutRoot",$:[y,f,l]});d.declare(`
#layoutRoot
{
    padding-top: var(--header-height);
}
`);function b(){new g().mount("body")}b();
