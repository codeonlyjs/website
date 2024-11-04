import { Router, WebHistoryRouterDriver, ViewStateRestoration } from "@codeonlyjs/core";

export let router = new Router(new WebHistoryRouterDriver());

new ViewStateRestoration(router);

