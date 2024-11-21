var V=Object.defineProperty;var D=i=>{throw TypeError(i)};var W=(i,e,t)=>e in i?V(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var o=(i,e,t)=>W(i,typeof e!="symbol"?e+"":e,t),S=(i,e,t)=>e.has(i)||D("Cannot "+t);var n=(i,e,t)=>(S(i,e,"read from private field"),t?t.call(i):e.get(i)),l=(i,e,t)=>e.has(i)?D("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t),r=(i,e,t,a)=>(S(i,e,"write to private field"),a?a.call(i,t):e.set(i,t),t);import{C as d,H as q,$ as f,c as h,e as A,D as K,r as m,t as H,a as N,b as F,d as J}from"./HeroPage-C8gZju3F.js";class B extends d{constructor(){super()}onMount(){}onUnmount(){}}o(B,"template",[q,f.div.class("homePage")(f.a("Read the Guide ›").href("/guide/"))]);h`
.homePage
{
    text-align: center;
    margin-bottom: 50px;
}
`;class L extends d{}o(L,"template",{type:"header",id:"mobile-bar",$:[{type:"button",class:"subtle muted",id:"side-panel-menu-button",on_click:e=>e.dispatchEvent(new Event("showPanel")),$:[{type:"svg",attr_width:"20",attr_height:"20",attr_viewBox:"0 -960 960 960",attr_preserveAspectRatio:"xMidYMid slice",attr_role:"img",$:{type:"path",attr_d:"M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"}}," Menu"]},{type:"button",class:"subtle muted",id:"side-panel-menu-button",on_click:e=>e.dispatchEvent(new Event("showSecondaryPanel")),text:"On this page ›"}]});h`
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
`;var b,w,$,c;class Q extends EventTarget{constructor(){super(...arguments);l(this,b);l(this,w);o(this,"error");l(this,$);l(this,c)}setDocUrl(t){r(this,b,t);let a=new URL("toc",t).pathname;if(a==n(this,w)){this.error||this.dispatchEvent(new Event("ready"));return}r(this,w,a),this.load()}get toc(){return n(this,$)}set toc(t){r(this,$,t),r(this,c,null)}get pages(){if(!n(this,c)&&n(this,$)){r(this,c,[]);for(let t of this.toc)n(this,c).push(...t.pages)}return n(this,c)}load(){A.load(async()=>{this.error=!1,this.toc=null,this.dispatchEvent(new Event("changed"));try{const t=await fetch(`/content${n(this,w)}`);if(!t.ok)throw new Error(`Response status: ${t.status} - ${t.statusText}`);this.toc=await t.json(),this.dispatchEvent(new Event("changed")),this.dispatchEvent(new Event("ready"))}catch(t){this.error=!0,console.error(t.message)}})}next(t){if(!this.pages)return;let a=this.pages.findIndex(s=>new URL(s.url,n(this,b)).pathname==n(this,b).pathname);return a<0||(a+=t,a<0||a>=this.pages.length)?null:this.pages[a]}}b=new WeakMap,w=new WeakMap,$=new WeakMap,c=new WeakMap;let v=new Q;class U extends d{constructor(){super()}onMount(){this.listen(v,"changed",this.invalidate),this.listen(v,"ready",this.invalidate)}}o(U,"template",{type:"nav",id:"nav-main",$:[{foreach:()=>v.toc,$:[{type:"h5",text:e=>e.title},{type:"ul",$:{foreach:{items:e=>e.pages,itemKey:e=>e.url},type:"li",$:{type:"a",attr_href:e=>e.url,class_selected:e=>`/guide/${e.url=="."?"":e.url}`==window.location.pathname,text:e=>e.title}}}]}]});h`
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
`;var g,p,k,P;class Y extends d{constructor(){super();l(this,g);l(this,p,null);l(this,k);l(this,P)}get structure(){return n(this,g)}set structure(t){r(this,g,t),r(this,p,null),r(this,P,null),this.invalidate(),this.positionHighlight()}hidePopupNav(){this.dispatchEvent(new Event("hidePopupNav"))}onMount(){this.listen(document,"scroll",()=>{this.positionHighlight()})}onUnmount(){}positionHighlight(){var T;if(!n(this,g))return;(!n(this,k)||n(this,k)!=document.body.scrollHeight)&&(r(this,k,document.body.scrollHeight),r(this,p,null));let t=K.get().top;n(this,p)==null&&r(this,p,n(this,g).allHeadings.map(y=>{let O=document.getElementById(y.id).getBoundingClientRect();return{id:y.id,top:O.top+t}}));let a="";if(t>20){let y=window.innerHeight||0;t+=+y/2-200;for(let x of n(this,p)){if(x.top>t)break;a=x.id}}if(a==n(this,P))return;r(this,P,a);let s=this.domTree.rootNode.querySelector(`a[href='#${a}']`);if(s){let y=this.domTree.rootNode.getBoundingClientRect(),x=s.getBoundingClientRect();this.highlight.style.top=x.top-y.top-2,this.highlight.style.height=x.height+4,(T=s.scrollIntoViewIfNeeded)==null||T.call(s,!1)}}update(){super.update(),this.positionHighlight()}}g=new WeakMap,p=new WeakMap,k=new WeakMap,P=new WeakMap,o(Y,"template",{type:"nav",id:"secondary-nav",on_click:t=>t.hidePopupNav(),$:[{type:"div",class:"highlight",bind:"highlight"},{if:t=>{var a,s;return((s=(a=t.structure)==null?void 0:a.headings)==null?void 0:s.length)>0},$:{type:"a",class:"title",attr_href:"#",text:t=>t.structure.title??"On This Page"}},{type:"ul",class:"h1",$:{foreach:t=>{var a;return(a=t.structure)==null?void 0:a.headings},type:"li",$:[{type:"a",attr_href:t=>`#${t.id}`,text:t=>t.text},{if:t=>t.subHeadings,type:"ul",class:"h2",$:{foreach:t=>t.subHeadings,type:"li",$:[{type:"a",attr_href:t=>`#${t.id}`,text:t=>t.text}]}}]}}]});h`
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

`;class X extends d{constructor(){super();o(this,"activePanel",null);this.create(),m.addEventListener("mayLeave",()=>this.hidePanel())}loadRoute(t){v.setDocUrl(t.url),this.page=t.page,this.invalidate()}showPanel(){this.activePanel="primary",this.invalidate()}showSecondaryPanel(){this.activePanel="secondary",this.invalidate()}hidePanel(){this.activePanel=null,this.invalidate()}}o(X,"template",{type:"div#layoutDocumentation",$:[{type:L,on_showPanel:t=>t.showPanel(),on_showSecondaryPanel:t=>t.showSecondaryPanel()},{type:"div#div-wrapper",$:[{type:"div#backdrop",class_active:H(t=>t.activePanel!=null),on_click:t=>t.hidePanel()},{type:"div#div-lhs",class_active:H(t=>t.activePanel=="primary"),$:U},{type:"div#div-center",$:{type:"embed-slot",content:t=>t.page}},{type:"div#div-rhs",class_active:H(t=>t.activePanel=="secondary"),$:{type:Y,structure:t=>{var a;return(a=t.page)==null?void 0:a.structure},on_hidePopupNav:t=>t.hidePanel()}}]}]});const R=720,z=250;h`
:root
{
    --side-panel-width: ${z}px;
    --max-content-width: ${R}px;
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


@media screen and (width < ${z*2+R+25}px) 
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

@media screen and (width < ${z+R+25}px) 
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

`;class Z extends d{constructor(){super()}loadRoute(e){this.page=e.page,this.invalidate()}}o(Z,"template",{type:"div",id:"layoutBare",$:{type:"embed-slot",content:e=>e.page}});h`
#layoutBare
{
    max-width: 1050px;
    margin: 0 auto;
    padding-top: var(--header-height);
}
`;class M extends d{constructor(e){super(),this.url=e}}o(M,"template",{type:"div",class:"center",$:[{type:"h1",class:"danger",text:"Page not found! 😟"},{type:"p",text:e=>`The page ${e.url} doesn't exist!`},{type:"p",$:{type:"a",attr_href:"/",text:"Return Home"}}]});m.register({match:i=>(i.page=new M(i.url),!0),order:1e3});const _=class _ extends d{constructor(){super()}onMount(){this.listen(v,"ready",this.invalidate)}get next(){return v.next(1)}get previous(){return v.next(-1)}static link(e,t){return[{if:a=>!!a[e],type:"a",class:e,attr_href:a=>a[e].url,$:[{type:"div",class:"description muted",text:t},{type:"div",class:"title",text:a=>a[e].fullTitle}]},{else:!0,type:"div"}]}};o(_,"template",{type:"nav",class:"next-previous-navigation",$:[_.link("previous","‹ Previous"),_.link("next","Next ›")]});let I=_;h`
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
`;var E;class j extends d{constructor(t){super();l(this,E);r(this,E,t)}get document(){return n(this,E)}set document(t){r(this,E,t),this.invalidate()}get structure(){return this.document.structure}get layout(){var t,a;switch((a=(t=this.document)==null?void 0:t.frontmatter)==null?void 0:a.layout){case"bare":return Z;default:return X}}}E=new WeakMap,o(j,"template",[{type:F,document:t=>t.document},{type:I}]);m.register({pattern:"/:pathname*",match:async i=>{try{return i.document=new N,await i.document.load(i.match.groups.pathname),i.page=new j(i.document),!0}catch(e){if(e.pageLoadError)i.page=new M(i.url);else throw e}return!0},order:10});var C;let tt=(C=class extends d{constructor(){super(...arguments);o(this,"showIt",!0)}onClick(){this.showIt=!this.showIt,this.invalidate()}},o(C,"template",{type:"div .transition-demo1",$:[{type:"button on_click=onClick text=Toggle"}," mode:",{type:"select",bind:"mode",$:[f.option("concurrent"),f.option("enter-leave"),f.option("leave-enter")]},f.hr,{type:"div .container",$:[{if:H({value:t=>t.showIt,mode:t=>t.mode.value}),type:"div .item .hello",text:"Hello"},{else:!0,type:"div .item .bye",text:"Goodbye"}]}]}),C);h`
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
`;m.register({pattern:"/test",match:i=>(i.page=new tt,!0)});m.register({pattern:"/",match:i=>(i.page=new B,!0)});var u;class G extends d{constructor(){super();l(this,u,null);m.addEventListener("didEnter",(t,a)=>{var s;a.page&&(a.page.layout?(a.page.layout!=((s=n(this,u))==null?void 0:s.constructor)&&(r(this,u,new a.page.layout),this.layoutSlot.content=n(this,u)),n(this,u).loadRoute(a)):(this.layoutSlot.content=a.page,r(this,u,null)))})}}u=new WeakMap,o(G,"template",{type:"div",id:"layoutRoot",$:[{type:J,loggedIn:!0},{type:"embed-slot",bind:"layoutSlot"}]});h`
#layoutRoot
{
    padding-top: var(--fixed-header-height);
}

.vcenter
{
    display: flex;
    align-items: center;
}

`;function et(){new G().mount("body"),m.start()}et();
