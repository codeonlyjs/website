import fs from "node:fs/promises";
import path from "node:path";

export async function convert_toc(filename)
{
    let baseDir = path.dirname(path.resolve(filename));

    // Read toc file
    let input = await fs.readFile(filename, "utf8");
    let lines = input.split("\n");
    let result = [
    ];
    let section = null;
    for (let l of lines)
    {
        // Is it a new section
        let heading = l.match(/^#(.*)$/m);
        if (heading)
        {
            section = {
                title: heading[1],
                pages: [],
            }
            result.push(section);
            continue;
        }

        // Extract title from the page
        let filename = l.trim();
        if (filename.length == 0)
            continue;
        let full_filename = path.join(baseDir, filename + ".md");
        let title = `${filename} (missing)`;
        try
        {
            let file_content = await fs.readFile(full_filename, "utf8");

            let m = file_content.match(/^title:\s*"?(.*?)"?\s*$/m)
            if (m)
                title = m[1];
        }
        catch
        {
            // Ignore
        }

        if (filename == "index")
            filename = ".";
        if (filename.endsWith("/index"))
            filename = filename.substring(filename.length - 5) + '.';

        section.pages.push({
            url: filename,
            title: title,
        });
    }
    return result;
}

