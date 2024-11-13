export let featureBoxes = [
    {
        title: "Tool Free",
        body: `No transpiling, packaging or bundling to slow things down. 
               Debug your code in the browser <em>exactly</em> 
               as you wrote it.`
    },
    {
      title: "Build Anything",
      body: `Tiny web widgets, single page apps or full-stack setups. 
             All in plain, clean and modern ES6 JavaScript.`
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
        body: `DOM templates are JIT compiled and produce minimal DOM updates and we've 
               tuned it to run <em>fast!</em>.  ~14kB gzipped.`
    },
];


export let homeDemo = `### Logic, Templates and Styles...

...all in self contained .js files.

\`\`\`js
// demo code lab
class Main extends Component /* i: Components extend the \`Component\` class */
{
  count = 0; /* i: Class fields and functions are available to the template */

  onClick() /* i: Button click event handler */
  { 
    this.count++; 
    this.invalidate(); /* i: Marks the component as needing DOM update */
  }

  static template = { /* i: This is the component's DOM template */
    type: "div", /* i: Root element type */
    class: "counter", /* i: Scoping CSS class */
    $: [ /* i: Child nodes array */
      {
        type: "button",
        text: \`Click Me\`,
        on_click: c => c.onClick(), /* i: \`c\` is the component instance */
      },
      {
        type: "span",
        text: c => \`Count: \${c.count}\`, /* i: Callback for dynamic content */
      }
    ]
  }
}

Style.declare( /* i: CSS styles (with \`.counter\` as scoping class) */
\`
.counter
{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
\`); 
\`\`\`

[Read the Guide](/guide/)

`