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
        "@codeonlyjs/core": "https://cdn.jsdelivr.net/gh/codeonlyjs/core/dist/codeonly.min.js"
    }
}
</script>
</head>
<body>
<script type="module">
import { Component, Style } from "@codeonlyjs/core";
${script}
new Main().mount("body");
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