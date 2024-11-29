export let featureBoxes = [
    {
        title: "Tool Free",
        body: `No transpiling, packaging or bundling to slow things down. 
               Debug your code in the browser <em>exactly</em> 
               as you wrote it.`
    },
    {
      title: "Build Anything",
      body: `Embellish existing sites with tiny web widgets or build entire single page apps.  
             (Includes SPA suitable router)`
    },
    /*
    {
        title: "Non-Reactive",
        body: `Non-reactive and non-intrusive. No wrapper functions or proxies.
               Everything is kept as close to pure JavaScript as possible.`
    },
    */
    {
        title: "Fast and Small",
        body: `Component templates are JIT compiled, produce minimal DOM updates and we've 
               tuned it to run <em>fast!</em>.`
    },
];


export let homeDemo = `
\`\`\`js
// demo code
class Main extends Component /* i: Components extend the \`Component\` class */
{
  count = 0; /* i: Class fields and functions are available to the template */

  onClick() /* i: Button click event handler */
  { 
    this.count++; 
    this.invalidate(); /* i: Marks the component as needing DOM update */
  }

  static template = { /* i: This is the component's DOM template */
    type: "div.counter", /* i: Root element <div class="counter"> */
    $: [ /* i: Child nodes array */
      {
        type: "button",
        text: "Click Me",
        on_click: c => c.onClick(), /* i: \`c\` is the component instance */
      },
      {
        type: "span",
        text: c => \`Count: \${c.count}\`, /* i: Callback for dynamic content */
      }
    ]
  }
}

css\` /* i: CSS styles (with ".counter" as scoping class) */
.counter
{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
\` 
\`\`\`

`

export let codeOnlyBullets = [
  "Javascript DOM Templates",
  "No Markup/HTML",
  "No transpiling",
  "No build server",
]


export let featureBullets = [
  "Components",
  "Templating",
  "SPA Router",
  "Transitions",
  "Live Reload",
  "Code Generator"
]

export let reactivityBullets = [
  "No Proxy Objects",
  "No Wrappers",
  "Non-intrusive",
  "Easy to Debug",
  "Fast",
]

export let learnBullets = [
  "\"The Lab\" for Experiments", 
  "Project Generator",
  "Awesome Documentation",
  "Lots of Samples",
]