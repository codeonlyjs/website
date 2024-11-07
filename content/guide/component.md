---
title: "API"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---
# Component API

## constructor

## getCompiledTemplate Static Method

Gets the compiled template for this component class

## compileTemplate Static Method

Compiles the template for the component class

## isSingleRoot Static Property

Returns true if the template for this component is a single
DOM element as its root.

## create Method

Creates the DOM elements for this component.

Redundant if already called

```js
component.create()
```

## dom Property

Returns the instantiated DOM template of the component, creating
it if necessary.

```js
component.dom
```

## rootNode Property

Gets the root node of this component, or throws an exception if
this is not a multi-root component.

```js
component.rootNode
```


## rootNodes Property

Gets an array of root nodes for the component.

```js
component.rootNodes
```


## invalidate Method

Marks the component as needing a DOM update.

```js
component.invalidate()
```

## validate Method

Updates the component's DOM, if it's marked as invalid by 
a previous call to `invalidate()`.

```js
component.validate()
```

## update Method

Immediately updates the DOM elements of this component and
marks the component as not invalid.

```js
component.update()
```

```js
    loadError = null;

    async load(callback)
    {
        this.#loading++;
        if (this.#loading == 1)
        {
            this.loadError = null;
            this.invalidate();  
            env.enterLoading();
            this.dispatchEvent(new Event("loading"));
        }
        try
        {
            return await callback();
        }
        catch (err)
        {
            this.loadError = err;
        }
        finally
        {
            this.#loading--;
            if (this.#loading == 0)
            {
                this.invalidate();
                this.dispatchEvent(new Event("loaded"));
                env.leaveLoading();
            }
        }
    }

    #loading = 0;

    get loading()
    {
        return this.#loading != 0;
    }
    set loading(value)
    {
        throw new Error("setting Component.loading not supported, use load() function");
    }

    render(w)
    {
        this.dom.render(w);
    }

    destroy()
    {
        if (this.#dom)
        {
            this.#dom.destroy();
            this.#dom = null;
        }
    }

    onMount()
    {
    }

    onUnmount()
    {
    }

    #mounted = false;
    setMounted(mounted)
    {
        this.#dom?.setMounted(mounted);
        this.#mounted = mounted;
        if (mounted)
            this.onMount();
        else
            this.onUnmount();
    }

    mount(el)
    {
        if (typeof(el) === 'string')
        {
            el = document.querySelector(el);
        }
        el.append(...this.rootNodes);
        this.setMounted(true);
        return this;
    }

    unmount()
    {
        if (this.#dom)
            this.rootNodes.forEach(x => x. remove());
        this.setMounted(false);
    }

    static template = {};
}
```

## Next Steps

* Learn more about [Templates](templates)


