import fs from "node:fs/promises";
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { SSRWorker } from "@codeonlyjs/core";

let worker = new SSRWorker();
await worker.init({
      prebuild: "./prebuild.js",
      entryFile: "./main-ssr.js",
      entryMain: "main",
      entryHtml: await fs.readFile("./dist/index.html", "utf8"),
      entryUrls: [ "/" ],
      pretty: true,
});

test("render meta", async () => {
    let r = await worker.render("http://localhost:3000/guide/templateFluent");
    console.log(r.content);
});