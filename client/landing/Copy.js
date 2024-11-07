export let featureBoxes = [
    {
        title: "Tool Free",
        body: `No transpiling, packaging or bundling to slow things down. 
               Debug, edit and save your code in the browser <em>exactly</em> 
               as you wrote it.`
    },
    {
        title: "Non-Reactive",
        body: `Non-reactive and non-intrusive. No wrapper functions or proxies.
               Everything is kept as close to pure JavaScript as possible.`
    },
    {
        title: "Fast and Small",
        body: `DOM templates are JIT compiled, minimal DOM updates and we've 
               tuned it to run <em>fast!</em><br>&lt; 14kB gzipped.`
    },
];


export let homeDemo = `### Logic, Templates and Styles...

...all in self contained .js files.

\`\`\`js
// demo
class Main extends Component /* Components extend the \`Component\` class */
{
  count = 0; /* Class fields and functions are available to the template */

  onClick() /* Button click event handler */
  { 
    this.count++; 
    this.invalidate(); /* Marks the component as needing DOM update */
  }

  static template = { /* This is the component's DOM template */
    type: "div", /* Root element type */
    class: "counter", /* Scoping CSS class */
    $: [ /* Child nodes array */
      {
        type: "button",
        text: \`Click Me\`,
        on_click: c => c.onClick(), /* \`c\` is the component instance */
      },
      {
        type: "span",
        text: c => \`Count: \${c.count}\`, /* Callback for dynamic content */
      }
    ]
  }
}

Style.declare( /* CSS styles (with \`.counter\` as scoping class) */
\`
.counter
{
  button
  {
    margin-right: 10px
  }
}
\`); 
\`\`\`

[Read the Guide](/guide/)

`