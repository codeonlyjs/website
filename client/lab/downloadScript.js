export function findMainClass(script)
{
    let classes = Array.from(script.matchAll(/\bclass\s+([-_a-zA-Z0-9]+)\s+extends\s+Component\b/g));
    // If no classes, assume Main
    if (classes.length == 0)
        return "Main";
    // If just one class, use it
    if (classes.length == 1)
        return classes[0][1];
    // If there's a main class, use it
    if (classes.some(x => x[1] == "Main"))
        return "Main";
    // Otherwise, use the last class
    return classes.pop()[1];
}

export function downloadScript(script)
{
    let html = `<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CodeOnly Lab</title>
<link href="https://cdn.jsdelivr.net/gh/codeonlyjs/stylish/stylish.css" type="text/css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/codeonlyjs/stylish/stylish-theme.min.js"></script>

<script type="importmap">
{
    "imports": {
        "@codeonlyjs/core": "https://cdn.jsdelivr.net/gh/codeonlyjs/core@0.0.57/dist/codeonly.min.js"
    }
}
</script>
</head>
<body>
<script type="module">
import { $, Component, css, html, htmlEncode, input, transition } from "@codeonlyjs/core";
${script}
new ${findMainClass(script)}().mount("body");
</script>
</body>
</html>
`
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(html));
    element.setAttribute('download', "codeonly.html");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}