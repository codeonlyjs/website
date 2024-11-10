---
title: "Embed Slots"
---
# Embed Slots

Embed slots provide a place in a template where other content can be loaded.

They're commonly used for:

* Loading non-template sourced DOM elements
* Loading router pages into the main content area of a single page app
* "Pushing down" content templates into nested components


## Declaring an Embed Slot

Embed slots are declared in a template using the special type name "`embed-slot`":

```js
{
    type: "div", /* A <div> element... */
    $: {
        type: "embed-slot", /* ...with a contained embed-slot */
    }
}
```

## Loading Content into an Embed Slot

To set the content of an embed slot, use the embed slot's "content" property. You
can do this either with an dynamic callback property:

```js
{
    type: "div",
    $: {
        type: "embed-slot",
        content: c => c.getContent(),
    }
}
```

Or, by binding to the embed slot to your component:

```js
{
    type: "div",
    $: {
        type: "embed-slot",
        bind: "pageSlot"        /* Bind the embed slot to the component */
    }
}
```

and setting the content directly:

```js
// Load a page component from a route into the page slot
this.pageSlot = router.current.page
```


## Content Types

Embed slots support various kinds of content:

* CodeOnly Components
* Arrays of HTML DOM nodes
* Single HTML DOM nodes
* HTML raw string (as returned by `Html.raw()`)
* Plain string (will be escaped)
* CodeOnly DOM Trees



## Placeholders

An embed slot can have a placeholder that's shown when the content property
is not set:


```js
{
    type: "div",
    $: {
        type: "embed-slot",
        placeholder: {
            type: "div",
            class: "no-active-page",
            text: "Nothing to see here!",
        }
    }
}
```

## Exported Component Slots

A component can export embed slots letting content from an outer
containing template to be injected (or "pushed down") into the component.

Consider the following component which implements a custom link that has 
some special click handling logic:

```js
export class MyLink extends Component
{
    #href = "#";
    get href() { return this.#href; }
    set href(value) { this.#href = value; this.invalidate() }

    #title = "link";
    get title() { return this.#title; }
    set title(value) { this.#title = value; this.invalidate() }

    on_click(ev)
    {
        // Special click handling goes here
    }

    static template = {
        type: "a",
        attr_href: c => c.href,
        on_click: (c, ev) => c.on_click(ev),
        $: c => c.title
    };
}
```

This component can then be used to create links with the special click handling:

```js
{
    type: "div",
    $: [
        { type: MyLink, href: "/", title: "Home" },
        { type: MyLink, href: "/profile", title: "Profile" },
    ]
}
```

The `MyLink` class provides a nice way to encapsulate the special link handling
logic however it's currently limited to only being able to show plain text as
the link text.

We can improve on this by using an embed-slot to allow any arbitrary content to 
be used as the link content:

```js
export class MyLink extends Component
{
    // everything else as before

    static template = {
        type: "a",
        attr_href: c => c.href,
        on_click: c => c.on_click(ev),
        $: {
            type: "embed-slot", /* Special name "embed-slot" */
            bind: "content", /* Make this slot available as a component property */
            placeholder: c => c.title, /* Revert to text if no slot content */
        }
    }

    static slots = [ "content" ]; /* Slot names need to be declared */
}
```

<div class="tip">

Notice the slot names need to be explicitly declared using the `static slots` 
declaration on the component class.  

This is required as the template compiler generates code to handle
embed slots and needs to know at compile time whether to treat assignments
to component properties as slot assignments or as a regular property assignment.

</div>

We can now use this like so:

```js
{
    type: MyLink, 
    href: "/", 
    content: [ /* This image and "Home" text are used as the link content */
        {
            type: "img",
            attr_src: "home_button.png",
        },
        " Home",
    ]
}
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
  could have used `$: [...]` instead of `content: [...]`.


