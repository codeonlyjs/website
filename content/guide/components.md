---
title: "Overview"
---
# Components Overview

Components are the primary building block for constructing CodeOnly
applications. They encapsulate program logic, a DOM (aka HTML) template 
and an optional a set of CSS styles.

Components can be used either in the templates of other components
or mounted onto the document DOM to appear in a web page.


## Anatomy of a Component

Most components will conform to this common structure:

```js
import { Component, css } from "@codeonlyjs/core";

// Components extend the 'Component' class
export class MyComponent extends Component
{
    // Logic
    constructor()
    {
        super()
    }

    // DOM template
    static template = {

    }
}

// CSS styles
css`
`;
```

<div class="tip">

By declaring logic, templates and styles in code the entire
definition of a component can be contained in a single `.js` file.

</div>



## Logic

A component is just a regular JavaScript class so its "logic"
can be anything you like, but will typically consist of:

* Business logic
* Data fetching
* Public properties to configure the component
* Properties and methods to support the template
* Event handling and dispatching
* Life-cycle handlers (eg: `onMount()`, `onUnmount()`)



## Templates

A component's template declares the HTML elements that will appear
in the document and provide the visual representation of the component.

Templates are [covered in detail here](templates), but since they're 
central to understanding components the following is a brief introduction.

A template is a JSON-like object that describes the DOM structure of a 
component - that is the set of HTML elements that comprise the component's
appearance.

Most components will declare their template using a static
field named `template` on the component class.



```js
// lab demo code
class MyComponent extends Component
{
    static template = {  /* i:  This component's template */
        type: "div",
        text: "This is My Component",        
    }
}
```

<div class="tip">

Templates are declared static because they are compiled at runtime to JavaScript 
and it would be extremely inefficient to re-compile for each component instance.  

The template is compiled the first time an instance of a component is constructed 
and re-used for all subsequent instances.

</div>


## Dynamic Content

A template can use fat arrow (`=>`) callbacks for dynamic content.

The callback is passed a reference to the owning component instance
and by convention the argument is usually named `c` (for "component"):

This example sets a `<div>`'s inner text using the component's `greeting`
property:

```js
    static template = {
        type: "div",
        text: c => c.greeting, /* i: Callback to get text content */
    }
```


When the value of any dynamic content changes, the component needs to 
be updated to apply those changes in the DOM using one of these two
methods:

* `update()` - updates the DOM immediately
* `invalidate()` - schedules the component to be updated on the next
  update cycle.

<div class="tip">

In general you should use `invalidate()` as it coaelesces multiple 
updates into a single DOM update.  This is more efficient as it saves
the browser from multiple reflows.

</div>

The following example toggles the text shown in a `<div>` each time
it is clicked.

```js
// lab demo code
class MyComponent extends Component
{
    #on = false;

    // A dynamic property used by the template
    get text() 
    { 
        return this.#on ? "On" : "Off";
    }

    onClick()
    {
        this.#on = !this.#on;
        this.invalidate(); /* i: Tells component to update */
    }

    static template = {
        type: "div",
        text: c => c.text, /* i: Callback for dynamic content */
        on_click: "onClick",
    }
}
```

Templates also support events, conditional blocks, list rendering, 
embed slots, CSS transitions and more.  See [Templates](templates) 
for more on working with templates.



## Dispatching Events

The `Component` class extends the standard `EventTarget` class so
components can dispatch (aka "fire" or "raise") events.

Here is a custom button component dispatching a "click" event:

```js
// lab demo code
// A component that raises "click" events
class MyButton extends Component  /* i:  Component extends EventTarget */
{
    onClick()
    {
        this.dispatchEvent(new Event("click")); /* i: Raise event */
    }

    static template = {
        type: "button",
        text: "MyButton",
        on_click: c => c.onClick(),
    }
}

// ---

class Main extends Component
{
    onMyButtonClick()
    {
        alert("Received click from MyButton");
    }

    static template = {
        type: MyButton,
        on_click: (c) => c.onMyButtonClick(), /* i: Listen to events from component */
    }
}
// ---
```

<div class="tip">

In some of the samples, like the one above, we've hidden some of the 
supporting code to help emphasize the point being made.  

These snipped sections of code are indicated with the scissor icon:

<div class="snip" title="Some code omitted for clarity." style="margin-top: 20px;margin-bottom: 20px"><span class="hline"></span><svg xmlns="http://www.w3.org/2000/svg&quot;" height="16px" width="16" viewBox="0 -960 960 960"><path d="M760-120 480-400l-94 94q8 15 11 32t3 34q0 66-47 113T240-80q-66 0-113-47T80-240q0-66 47-113t113-47q17 0 34 3t32 11l94-94-94-94q-15 8-32 11t-34 3q-66 0-113-47T80-720q0-66 47-113t113-47q66 0 113 47t47 113q0 17-3 34t-11 32l494 494v40H760ZM600-520l-80-80 240-240h120v40L600-520ZM240-640q33 0 56.5-23.5T320-720q0-33-23.5-56.5T240-800q-33 0-56.5 23.5T160-720q0 33 23.5 56.5T240-640Zm240 180q8 0 14-6t6-14q0-8-6-14t-14-6q-8 0-14 6t-6 14q0 8 6 14t14 6ZM240-160q33 0 56.5-23.5T320-240q0-33-23.5-56.5T240-320q-33 0-56.5 23.5T160-240q0 33 23.5 56.5T240-160Z"></path></svg><span class="hline"></span></div>

To view the unabridged code open the sample in the Lab by clicking the Edit 
button.

</div>

## Async Data Loads

Components will often need to load data from external sources. 
This is commonly referred to as "async data loading" and often 
a spinner will be shown while the data is being fetched.

Since this is a common pattern for many components, the `Component`
class includes a couple of helpers: a `load` method, a `loading` and
`loadError` property and some associated events.

The `load` method does the following:

1. sets the `loading` property to true 
2. clears the `loadError` property
3. calls the `invalidate` method to mark the component for update
4. dispatches a `loading` event
5. calls and `await`s the supplied callback
6. catches and stores any thrown errors to the `loadError` property
7. calls the `invalidate` method again
8. dispatches a `loaded` event

For example:

```js
// lab demo code
class Main extends Component
{
    loadData()
    {
        this.load(async () => {
            // Load data here
// ---
            let response = await fetch("https://swapi.dev/api/people/3/");
            this.data = await response.json();
// ---
        });
    }


    static template = [
        {
            if: c => c.loading, /* i: Show spinner while loading */
            type: "div .spinner",
        },
        {
            else: true, /* i: Otherwise show loaded data */
            $: [
                // Display data here
// ---
                {
                    type: "span",
                    text: c => `Name: ${c.data?.name ?? "No Data"} `,
                },
                {
                    type: "button",
                    text: "Load Data",
                    on_click: c => c.loadData(),
                }
// ---

            ]
        }
    ]
}
```

Using this approach provides a couple of benefits:

* The `load` method is `async`, so you can `await` it to know
  when the load has finished.
* It's exception safe - any thrown errors are captured and the 
  `loading` flag is cleared on success or failure.
* It provides an easy mechanism for a component to know if
  data, an error or a spinner should be shown.
* It's integrated with a broader "environment" loading mechanism 
  so other interested parties (eg: server side rendering) can
  be notified when the entire page is loaded - more on this later.

The `load` method also supports a second parameter `silent`.  Silent
mode allows refreshing the data without showing spinners or other
feedback:

1. calls and awaits the supplied callback
2. calls the invalidate method 



## Mounting Components

Mounting a component makes it appear on the page.

Most components are mounted automatically by parent components, but
 the root of your application needs to be mounted manually.

To mount a component, call the `mount` method passing an element 
or selector indicating where the component should be appear:

eg: 

`main.js`

```js
// Main component
class MainPage extends Component
{
}


// Main entry point into the application
export function main()
{
    // Create main page and mount it in div#main
    new MainPage().mount("#main");

    // Other app initialization can go here
}
```

`index.html`

```js
<html>
<body>
    <!-- This is where the Main component will be mounted --> 
    <div id="main"></div>
    
    <script type="module">  
        // Call "main" method to mount the component
        import { main } from "/main.js";
        main();
    </script>
</body>
</html>

```

<div class="tip">

Although this example shows how a typical single-page-application
might mount the top-level component, the same approach can be used 
to mount smaller widgets, controls and panels - even if the rest 
of the project doesn't use CodeOnly.

</div>


## Component Life-Cycle

Components have the following life-cycle states:

* **Constructed**: Immediately after the JavaScript object is constructed
but before the DOM elements have been created. 

* **Created**: After the DOM elements have been created. Usually this 
happens automatically just before the component is mounted.  If you
need to access the DOM elements beforehand, call the `create()` method.

* **Mounted**: After the component's DOM is attached to the document DOM.
The component's `onMount()` method is called when it's mounted.

* **Unmounted**: After a component is removed from the document DOM.  
The component's `onUnmount()` method is called when it's unmounted.

* **Destroyed**: After a parent component that constructed this component
no longer needs the component it will call the component's `destroy()`
method which releases the DOM elements associated with the component.

In general a component should connect to external resources in the
`onMount()` and disconnect from them in `onUnmount()`.  These are
the most reliable mechanism to know if a component is still in use.

A component will never be destroyed while it's mounted.

A destroyed component is effectively reset to the "constructed" state
and can re-created if necessary.  


## Listening to External Events

When a component needs to listen to external events care must be
taken to ensure the event handlers are removed otherwise dangling
references to the component may prevent it from being garbage
collected by the JavaScript runtime.

The correct way to handle this is for the component to add
event listeners when the component is mounted and remove them
when the component is unmounted.

This can be done manually by overriding `onMount()` and `onUnmount()`
but a simpler method is to use the `Component.listen` method.

```js
listen(target, event, handler)
```

where:

* `target` - any object that supports `add/removeEventListener()`
* `event` - the event to listen for
* `handler` - a handler function for the event.

The `listen` function automatically adds the event listener when
the component is mounted and removes the event listener when the 
component is unmounted.

See [listen()](component#component-class-listen) for more.



## Styles

To declare CSS styles associated with your component, use the 
<code>css``</code> template literal function.  It takes a CSS string and adds
it to the `<head>` section of the document.

We recommend scoping your styles to a component specific CSS class 
to avoid name clashes.

The example scopes its content with the class name `my-component`
and nests styles within that class.  Styles declared for the `<p>` 
element only apply to those in this component.

```js
// lab code demo
class MyComponent extends Component
{
  static template = { 
    type: "div", 
    class: "my-component",
    $: [ 
        // Child elements
        {
            type: "p",
            text: "A Styled Paragraph",
        }
    ]
  }
}

css`
.my-component
{
    p
    {
        text-align: center;
        font-weight: bold;
        color: orange;
    }
}
`; 
```

<div class="tip">

Styles declared with <code>css``</code> are added to the document
exactly as declared.  The above example is using nested CSS 
for scoping which requires a reasonably modern browser.

If you need to work with old browsers that don't support this you
will need to either manually de-nest your declarations or use an 
external CSS preprocesor (LESS, SASS etc...) - but they can't be
used with the <code>css``</code> function.

</div>


## Custom Templates

Normally components use the template declared by the static `template` 
property but this can be changed by overriding the `onProvideTemplate()`
function.

```js
class MyComponent extends Component
{
    // Called by Component to get the template to be compiled
    static onProvideTemplate()
    {
        return {
            // ... template definition ...
        }
    }
}
```

Consider, for example, a dialog class where every dialog has the same frame
but different content in the main body.

```js
// lab code demo
class Dialog extends Component
{
// ---
    showModal()
    {
        // Add dialog to the document and show it
        document.body.appendChild(this.domTree.rootNode);
        this.domTree.rootNode.showModal();

        // Remove from document when closed
        this.domTree.rootNode.addEventListener("close", () => {
            this.domTree.rootNode.remove();
        });
    }

// ---
    // Override to wrap template in dialog frame
    static onProvideTemplate()
    {
        return {
            type: "dialog",
            class: "dialog",
            id: this.template.id, /* i: From the derived class template */
            $: {
                type: "form",
                method: "dialog",
                $: [
                    {
                        type: "header",
                        $: this.template.title, /* i: From the derived class template */
                    },
                    {
                        type: "main",
                        $: this.template.content,  /* i: From the derived class template */
                    },
                    {
                        type: "footer",
                        $: {
                            type: "button",
                            $: "Close",
                        }
                    },
                ]
            }
        };
    }
}
// ---

// Styling common to all dialogs
css`
dialog.dialog
{
    header
    {
        padding: 10px;
    }
}
`;


// ---

class MyDialog extends Dialog /* i: extending Dialog, not Component */
{
    // This template will be "re-templated" by the base Dialog class
    // to wrap it in <dialog>, <form> etc...
    static template = {
        title: "My Dialog's Title",
        id: "my-dialog",
        content: {
            type: "p",
            $: "Hello World!  This is the dialog's content",
        }
    }
}

// ---

// Styling specific to this dialog class
css`
#my-dialog
{
}
`;


class Main extends Component
{
    onClick()
    {
        let dlg = new MyDialog();
        dlg.showModal();
    }
    static template = {
        type: "button",
        text: "Show Dialog",
        on_click: "onClick"
    }
}
// ---
```

<div class="tip">

In the above example, anything not directly related to template handling has been
omitted. Click the "Edit" link above to see the full code.

</div>

Notice how the enclosing `dialog`, `form`, `header`, `main` and `footer` elements
are provided automatically by the base `Dialog` class, but the content of the `header`
and `main` elements is provided by the derived `MyDialog` class

```html
<dialog class="dialog" id="my-dialog">
    <form method="dialog">
        <header>
            My Dialog
        </header>
        <main>
            <p>Hello World</p>
        </main>
        <footer>
            <button>Close</button>
        </footer>
    </form>
</dialog>
```



## Next Steps

* Learn more about [Templates](templates)


