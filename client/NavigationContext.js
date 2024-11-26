import { getEnv } from "@codeonlyjs/core";

class NavigationContext extends EventTarget
{
    setDocUrl(url)
    {
        this.#docUrl = url;
        let newTocPath = new URL("toc", url).pathname;
        if (newTocPath == this.#tocPath)
        {
            if (!this.error)
            {
                this.dispatchEvent(new Event("ready"));
            }
            return;
        }
        this.#tocPath = newTocPath;
        this.load();
    }

    #docUrl;
    #tocPath;
    error;
    #toc;
    #pages;

    get toc()
    {
        return this.#toc;
    }
    set toc(value)
    {
        this.#toc = value;
        this.#pages = null;
    }

    get pages()
    {
        if (!this.#pages)
        {
            if (this.#toc)
            {
                this.#pages = [];
                for (let s of this.toc)
                {
                    this.#pages.push(...s.pages);
                }
            }
        }
        return this.#pages;
    }

    load()
    {
        getEnv().load(async () => {
            this.error = false;
            this.toc = null;
            this.dispatchEvent(new Event("changed"));
            try 
            {
                const response = await fetch(`/content${this.#tocPath}`);
                if (!response.ok)
                    throw new Error(`Response status: ${response.status} - ${response.statusText}`);
        
                this.toc = await response.json();
                this.dispatchEvent(new Event("changed"));
                this.dispatchEvent(new Event("ready"));
            } 
            catch (error) 
            {
                this.error = true;
                console.error(error.message);
            }
        });
    }

    next(delta)
    {
        if (!this.pages)
            return;

        let index = this.pages.findIndex(x => 
            new URL(x.url, this.#docUrl).pathname == this.#docUrl.pathname
            );
        if (index < 0)
            return null;

        index += delta;
        if (index < 0 || index >= this.pages.length)
            return null;
        return this.pages[index];
    }
}

export let navigationContext = new NavigationContext();