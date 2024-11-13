var j=Object.defineProperty;var C=a=>{throw TypeError(a)};var O=(a,e,t)=>e in a?j(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var o=(a,e,t)=>O(a,typeof e!="symbol"?e+"":e,t),D=(a,e,t)=>e.has(a)||C("Cannot "+t);var n=(a,e,t)=>(D(a,e,"read from private field"),t?t.call(a):e.get(a)),l=(a,e,t)=>e.has(a)?C("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,t),r=(a,e,t,i)=>(D(a,e,"write to private field"),i?i.call(a,t):e.set(a,t),t);import{C as d,H as V,$ as M,S as u,e as W,D as q,r as E,t as _,a as A,N as F,b as G,c as K}from"./HeroPage-kLtwcHWl.js";class T extends d{constructor(){super()}onMount(){}onUnmount(){}}o(T,"template",[V,M.div.class("homePage")(M.a("Read the Guide ›").href("/guide/"))]);u.declare(`
.homePage
{
    text-align: center;
    margin-bottom: 50px;
}
`);class B extends d{}o(B,"template",{type:"header",id:"mobile-bar",$:[{type:"button",class:"subtle muted",id:"side-panel-menu-button",on_click:e=>e.dispatchEvent(new Event("showPanel")),$:[{type:"svg",attr_width:"20",attr_height:"20",attr_viewBox:"0 -960 960 960",attr_preserveAspectRatio:"xMidYMid slice",attr_role:"img",$:{type:"path",attr_d:"M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"}}," Menu"]},{type:"button",class:"subtle muted",id:"side-panel-menu-button",on_click:e=>e.dispatchEvent(new Event("showSecondaryPanel")),text:"On this page ›"}]});u.declare(`
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
`);var x,f,w,h;class J extends EventTarget{constructor(){super(...arguments);l(this,x);l(this,f);o(this,"error");l(this,w);l(this,h)}setDocUrl(t){r(this,x,t);let i=new URL("toc",t).pathname;if(i==n(this,f)){this.error||this.dispatchEvent(new Event("ready"));return}r(this,f,i),this.load()}get toc(){return n(this,w)}set toc(t){r(this,w,t),r(this,h,null)}get pages(){if(!n(this,h)&&n(this,w)){r(this,h,[]);for(let t of this.toc)n(this,h).push(...t.pages)}return n(this,h)}load(){W.load(async()=>{this.error=!1,this.toc=null,this.dispatchEvent(new Event("changed"));try{const t=await fetch(`/content${n(this,f)}`);if(!t.ok)throw new Error(`Response status: ${t.status} - ${t.statusText}`);this.toc=await t.json(),this.dispatchEvent(new Event("changed")),this.dispatchEvent(new Event("ready"))}catch(t){this.error=!0,console.error(t.message)}})}next(t){if(!this.pages)return;let i=this.pages.findIndex(s=>new URL(s.url,n(this,x)).pathname==n(this,x).pathname);return i<0||(i+=t,i<0||i>=this.pages.length)?null:this.pages[i]}}x=new WeakMap,f=new WeakMap,w=new WeakMap,h=new WeakMap;let v=new J;class I extends d{constructor(){super()}onMount(){this.listen(v,"changed",this.invalidate),this.listen(v,"ready",this.invalidate)}}o(I,"template",{type:"nav",id:"nav-main",$:[{foreach:()=>v.toc,$:[{type:"h5",text:e=>e.title},{type:"ul",$:{foreach:{items:e=>e.pages,itemKey:e=>e.url},type:"li",$:{type:"a",attr_href:e=>e.url,class_selected:e=>`/guide/${e.url=="."?"":e.url}`==window.location.pathname,text:e=>e.title}}}]}]});u.declare(`
#nav-main
{
    x-background-color: purple;
    width: 100%;
    height: 100%;

    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 10px;

    padding: 0rem 1rem 1rem 1rem;

    ul
    {
        font-size: 0.8rem;
        li
        {
            padding-top: 0.5rem;
            line-height: 1.2rem;
        }
    }

    a.selected
    {
        color: var(--accent-color);
    }

}
`);var g,c,b,k;class U extends d{constructor(){super();l(this,g);l(this,c,null);l(this,b);l(this,k)}get structure(){return n(this,g)}set structure(t){r(this,g,t),r(this,c,null),r(this,k,null),this.invalidate(),this.positionHighlight()}hidePopupNav(){this.dispatchEvent(new Event("hidePopupNav"))}onMount(){this.listen(document,"scroll",()=>{this.positionHighlight()})}onUnmount(){}positionHighlight(){var S;if(!n(this,g))return;(!n(this,b)||n(this,b)!=document.body.scrollHeight)&&(r(this,b,document.body.scrollHeight),r(this,c,null));let t=q.get().top;n(this,c)==null&&r(this,c,n(this,g).allHeadings.map(m=>{let Z=document.getElementById(m.id).getBoundingClientRect();return{id:m.id,top:Z.top+t}}));let i="";if(t>20){let m=window.innerHeight||0;t+=+m/2-200;for(let y of n(this,c)){if(y.top>t)break;i=y.id}}if(i==n(this,k))return;r(this,k,i);let s=this.domTree.rootNode.querySelector(`a[href='#${i}']`);if(s){let m=this.domTree.rootNode.getBoundingClientRect(),y=s.getBoundingClientRect();this.highlight.style.top=y.top-m.top-2,this.highlight.style.height=y.height+4,(S=s.scrollIntoViewIfNeeded)==null||S.call(s,!1)}}update(){super.update(),this.positionHighlight()}}g=new WeakMap,c=new WeakMap,b=new WeakMap,k=new WeakMap,o(U,"template",{type:"nav",id:"secondary-nav",on_click:t=>t.hidePopupNav(),$:[{type:"div",class:"highlight",bind:"highlight"},{if:t=>{var i,s;return((s=(i=t.structure)==null?void 0:i.headings)==null?void 0:s.length)>0},$:{type:"a",class:"title",attr_href:"#",text:t=>t.structure.title??"On This Page"}},{type:"ul",class:"h1",$:{foreach:t=>{var i;return(i=t.structure)==null?void 0:i.headings},type:"li",$:[{type:"a",attr_href:t=>`#${t.id}`,text:t=>t.text},{if:t=>t.subHeadings,type:"ul",class:"h2",$:{foreach:t=>t.subHeadings,type:"li",$:[{type:"a",attr_href:t=>`#${t.id}`,text:t=>t.text}]}}]}}]});u.declare(`
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

`);class L extends d{constructor(){super();o(this,"activePanel",null);this.create(),E.addEventListener("mayLeave",()=>this.hidePanel())}loadRoute(t){v.setDocUrl(t.url),this.page=t.page,this.invalidate()}showPanel(){this.activePanel="primary",this.invalidate()}showSecondaryPanel(){this.activePanel="secondary",this.invalidate()}hidePanel(){this.activePanel=null,this.invalidate()}}o(L,"template",{type:"div#layoutDocumentation",$:[{type:B,on_showPanel:t=>t.showPanel(),on_showSecondaryPanel:t=>t.showSecondaryPanel()},{type:"div#div-wrapper",$:[{type:"div#backdrop",class_active:_(t=>t.activePanel!=null),on_click:t=>t.hidePanel()},{type:"div#div-lhs",class_active:_(t=>t.activePanel=="primary"),$:I},{type:"div#div-center",$:{type:"embed-slot",content:t=>t.page}},{type:"div#div-rhs",class_active:_(t=>t.activePanel=="secondary"),$:{type:U,structure:t=>{var i;return(i=t.page)==null?void 0:i.structure},on_hidePopupNav:t=>t.hidePanel()}}]}]});const H=720,z=250;u.declare(`
:root
{
    --side-panel-width: ${z}px;
    --max-content-width: ${H}px;
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


@media screen and (width < ${z*2+H+25}px) 
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

@media screen and (width < ${z+H+25}px) 
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



`);class Y extends d{constructor(){super()}loadRoute(e){this.page=e.page,this.invalidate()}}o(Y,"template",{type:"div",id:"layoutBare",$:{type:"embed-slot",content:e=>e.page}});u.declare(`
#layoutBare
{
    max-width: 1050px;
    margin: 0 auto;
    padding-top: var(--header-height);
}
`);const P=class P extends d{constructor(){super()}onMount(){this.listen(v,"ready",this.invalidate)}get next(){return v.next(1)}get previous(){return v.next(-1)}static link(e,t){return[{if:i=>!!i[e],type:"a",class:e,attr_href:i=>i[e].url,$:[{type:"div",class:"description muted",text:t},{type:"div",class:"title",text:i=>i[e].fullTitle}]},{else:!0,type:"div"}]}};o(P,"template",{type:"nav",class:"next-previous-navigation",$:[P.link("previous","‹ Previous"),P.link("next","Next ›")]});let R=P;u.declare(`
.next-previous-navigation
{
    border-top: 1px solid var(--gridline-color);
    padding-top: 15px;
    display: flex;
    margin: 0 30px 80px 30px;
    justify-content: space-between;
    a
    {
        font-size: 0.9rem;
    }
    .next
    {
        text-align:right;
    }
    .description
    {
        font-size: 0.8rem;
        color: rgb(from var(--body-fore-color) r g b / 75%);
    }
}
`);var $;class N extends d{constructor(t){super();l(this,$);r(this,$,t)}get document(){return n(this,$)}set document(t){r(this,$,t),this.invalidate()}get structure(){return this.document.structure}get layout(){var t,i;switch((i=(t=this.document)==null?void 0:t.frontmatter)==null?void 0:i.layout){case"bare":return Y;default:return L}}}$=new WeakMap,o(N,"template",[{type:G,document:t=>t.document},{type:R}]);E.register({pattern:"/:pathname*",match:async a=>{try{return a.document=new A,await a.document.load(a.match.groups.pathname),a.page=new N(a.document),!0}catch{a.page=new F(a.url)}return!0},order:10});E.register({pattern:"/",match:a=>(a.page=new T,!0)});var p;class X extends d{constructor(){super();l(this,p,null);E.addEventListener("didEnter",(t,i)=>{var s;i.page&&(i.page.layout?(i.page.layout!=((s=n(this,p))==null?void 0:s.constructor)&&(r(this,p,new i.page.layout),this.layoutSlot.content=n(this,p)),n(this,p).loadRoute(i)):(this.layoutSlot.content=i.page,r(this,p,null)))})}}p=new WeakMap,o(X,"template",{type:"div",id:"layoutRoot",$:[{type:K,loggedIn:!0},{type:"embed-slot",bind:"layoutSlot"}]});u.declare(`
#layoutRoot
{
    padding-top: var(--fixed-header-height);
}

.vcenter
{
    display: flex;
    align-items: center;
}

`);function Q(){new X().mount("body"),E.start()}Q();
