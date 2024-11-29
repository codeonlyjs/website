import hljs from 'highlight.js';
import { Main } from "./Main.js";

globalThis.hljs = hljs;

// Main entry point, create Application and mount
export function main()
{
    new Main().mount("body");
}