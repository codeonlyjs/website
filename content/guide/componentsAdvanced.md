---
title: "Advanced"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---
# Component Advanced Topics

## Deep Component Updates

By default, when a template is updated any embedded components will
have changed dynamic properties applied, but the component's `update()`
method is not called - it's left to the component to detect property
changes an update or invalidate itself.

This behaviour can be changed with the `update` property in the parent
template, which can have one of the following values:

* A function - the template will call the function and if it returns
  a truthy value, the component will be updated.
* The string "auto" - the component will be updated if any of its 
  dynamic properties changed in value.
* Any other truthy value - the component will always be updated
* A falsey value - the component will never be updated

eg: Always update:

```js
template = {
    type: MyComponent,

    // update MyComponent when this template updates
    update: true,           
};
```

eg: Conditionally update:

```js
template = { 
    type: MyComponent,

    // update MyComponent if c.shouldUpdate is true
    update: c => c.shouldUpdate
}
```

eg: Automatically update:

```js
template = { 
    type: MyComponent,

    // update MyComponent only if any of the 
    // dynamic properties below changed
    update: "auto"

    prop1: c => c.prop1,
    prop2: c => c.prop2,
    prop3: c => c.prop3,
}
```


## Component Re-templating

Component re-templating is a technique where the template of a component
is modified by the component before it's compiled.

Normally the `Component.compileTemplate` method compiles the component's 
static `template` property as is, but by overriding this method we can 
adjust the template before it's compiled.

```js
class MyComponent extends Component
{
    // Called by Component the first time
    // an instance of this class is constructed
    static compileTemplate()
    {
        // Set up the modified template, lifting settings
        // from derived class template available on `this.template`
        let modifiedTemplate = {
            // ... whatever ...
        };

        // Now compile the modified template
        return Template.compile(modifiedTemplate);
    }
}
```

Consider, for example, a dialog class where you want to maintain the same 
frame around every dialog's content, but have different content in the main
body.

eg:

```js
class Dialog extends Component
{
    showModal()
    {
        // `this.dom` represents the instantiated template
        // - for single-root templates, the root node is
        //   available as this.dom.rootNode
        // - for multi-root templates, the root nodes are
        //   available as this.dom.rootNodes

        // Add dialog to the document and show it
        document.body.appendChild(this.dom.rootNode);
        this.dom.rootNode.showModal();

        // Remove from document when closed
        this.dom.rootNode.addEventListener("close", () => {
            this.dom.rootNode.remove();
        });
    }

    // Override to wrap template in dialog frame
    static compileTemplate()
    {
        let wrapperTemplate = {
            type: "dialog",
            class: "dialog",
            id: this.template.id,                   // From the derived class template
            $: {
                type: "form",
                attr_method: "dialog",
                $: [
                    {
                        type: "header",
                        $: this.template.title,     // From the derived class template
                    },
                    {
                        type: "main",
                        $: this.template.content,   // From the derived class template
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

        // Compile the wrapped template
        return Template.compile(wrapperTemplate);
    }
}

// Styling common to all dialogs
Style.declare(`
dialog.dialog
{
}
`);
```

Now, we can create a dialog:

```js
class MyDialog extends Dialog
{
    // This template will be "re-templated" by base Dialog
    // to wrap it in <dialog>, <form> etc... before compilation
    static template = {
        title: "My Dialog",
        id: "my-dialog",
        content: {
            type: "p",
            $: "Hello World",
        }
    }
}

// Show dialog
let dlg = new MyDialog();
dlg.showModal();

// Styling specific to this dialog class
Style.declare(`
#my-dialog
{
}
`);
```

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


