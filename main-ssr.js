import hljs from 'highlight.js';
import { Main } from "./Main.js";
import { Meta } from "./Meta.js";

globalThis.hljs = hljs;

// Main entry point, create Application and mount
export function main()
{
    new Meta().mount("head");
    new Main().mount("body");
}