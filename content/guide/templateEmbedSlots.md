---
title: "Embed Slots"
---
# Embed Slots

An embed slot provides a place in a template where other content can be loaded.

Embed slots are commonly used for:

* Loading non-template based DOM elements
* Loading router pages into the main content area of a single page app
* "Pushing down" content templates into nested components

Embed slots are declared with the special type name "`embed-slot`":

```js
{
    type: "div", /* i:  A <div> element... */
    $: {
        type: "embed-slot", /* i:  ...with a contained embed-slot */
    }
}
```

## Loading Content (dynamic callback)

To set the content of an embed slot, use the `content` property.

This can be done with a dynamic callback:

```js
// demo lab code
class Main extends Component
{
    getContent()
    {
        return "Hello World";
    }

    static template = {
        type: "DIV",
        $: {
            type: "embed-slot",
            content: c => c.getContent(),
        }
    }
}
```


## Loading Content (via binding)

The content of an embed-slot can also be set programatically by binding
the embed slot and directly setting its `content` property.

```js
// demo lab code
class Main extends Component
{
    constructor()
    {
        super();
        
        // Create DOM
        this.create();

        // Set content
        this.slot.content = "Hello World";
    }

    static template = {
        type: "DIV",
        $: {
            type: "embed-slot",
            bind: "slot"
        }
    }
}
```

## Content Types

Embed slots support various kinds of content.

* Plain strings
* HTML strings
* Components
* An array of, or a single HTML DOM nodes
* CodeOnly DOM Trees


### Plain Strings

Setting a plain string as the `content` property will create a text node as
the content.

It is safe to set untrusted data with this approach.

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "embed-slot",
        content: () => "<Hello World>",
    }
// ---
}
// ---
```

### HTML Strings

To set the content to a HTML string, use the `html()` directive.

It is *not safe* to set untrusted data with this approach.

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "embed-slot",
        content: () => html("<em>Hello World</em>"),
    }
// ---
}
// ---
```


### Components

The content property can be set to a component instance

```js
// demo lab code

class MyComponent extends Component
{
    static template = {
        type: "div",
        text: "This is a component"
    }
}

// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "embed-slot",
        content: () => new MyComponent(),
    }
// ---
}
// ---
```

### HTML DOM Nodes

An embed-slot's content can be set to either an array of, or a single HTML
DOM node.


```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "embed-slot",
        content: () => [
            document.createElement("hr"),
            document.createTextNode("Hello World"),
            document.createElement("hr"),
        ]
    }
// ---
}
// ---
```


## Placeholders

An embed slot can have a placeholder that's shown when the content property
is not set:


```js
// demo lab code
// ---
class Main extends Component
{
    content = null;

    onClick()
    {
        if (this.content == null)
            this.content = html("<p>Hello World</p>");
        else
            this.content = null;
        this.invalidate();
    }

    static template = [
// ---
    {
        type: "embed-slot",
        content: c => c.content,
        placeholder: html("<p>Nothing to see here</p>"),
    },
// ---
    {
        type: "button",
        text: "Toggle",
        on_click: "onClick"
    }
    ]
}
// ---
```


## Exported Component Slots

A component can export embed slots letting content from an outer
containing template to be injected (or "pushed down") into the component.

Consider the following component which implements a custom link that has 
some special click handling logic:

```js
// demo lab code
class MyLink extends Component
{
    #href = "#";
    get href() { return this.#href; }
    set href(value) { this.#href = value; this.invalidate() }

    #title = "link";
    get title() { return this.#title; }
    set title(value) { this.#title = value; this.invalidate() }

    on_click(ev)
    {
        ev.preventDefault();
        alert("Special link handling done here!");
    }

    static template = {
        type: "a",
        href: c => c.href,
        on_click: (c, ev) => c.on_click(ev),
        $: c => " " + c.title + " "
    };
}

class Main extends Component
{
    static template = {
        type: "div",
        $: [
            { type: MyLink, href: "/", title: "Home" },
            { type: MyLink, href: "/profile", title: "Profile" },
        ]
    }
}
```

The `MyLink` class provides a nice way to encapsulate the special link handling
logic however it's currently limited to only being able to show plain text as
the link text.

We can improve on this by using an embed-slot to allow any arbitrary content to 
be used as the link content:

```js
// code lab demo
class MyLink extends Component
{
// ---
    #href = "#";
    get href() { return this.#href; }
    set href(value) { this.#href = value; this.invalidate() }

    #title = "link";
    get title() { return this.#title; }
    set title(value) { this.#title = value; this.invalidate() }

    on_click(ev)
    {
        ev.preventDefault();
        alert("Special link handling done here!");
    }
// ---
    static template = {
        type: "a",
        href: c => c.href,
        on_click: (c, ev) => c.on_click(ev),
        $: {
            type: "embed-slot", /* i:  Special name "embed-slot" */
            bind: "content", /* i:  Make this slot available as a component property */
            placeholder: c => " " + c.title + " ", /* i:  Revert to text if no slot content */
        },
    };

    static slots = [ "content" ]; /* i:  Slot names need to be declared */
}

// ---
class Main extends Component
{
    static template = {
        type: "div .vcenter",
        $: 
// ---
        [
            { 
                type: MyLink, 
                href: "/", 
                content: {
                    type: "img",
                    src: "/codeonly-icon.svg",
                    style: "margin-right: 10px",
                    width: 24,
                    height: 24,
                } 
            },
            { type: MyLink, href: "/profile", title: "Profile" },
        ]
// ---
    }
}
// ---
```

Note the following:

* Instead of setting the text `title` property, we can now provide
  templated DOM elements via the `content` property

* If we don't set the content property, the `title` property still 
  works thanks to the `placeholder` property on the `EmbedSlot`.

* The embedded content could have dynamic properties referencing the 
  outer component class instance and they would update as per any 
  other template content.

* A component that has embed slots must declare them using the static
  `slots` property on the component class.  The template compiler
  needs to generate special code for embed slots and needs to known 
  up front which properties are templates.

* Since `$` is an alias for a component's `content` property, we
  could have used `$: {...}` instead of `content: {...}`.



## CSS Transitions

Embed slots can be used in conjunction with CodeOnly CSS transitions 
to produce animation effects when the content changes.

See [Transitions](templateTransitions) for more on this.
