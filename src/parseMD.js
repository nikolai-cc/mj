import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

function extractFrontmatter(markdown) {
    /* 
        Extracts YAML frontmatter delimited by "---" from input. 
        Returns raw input when there is no frontmatter.
    */
    const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);

    if (match) {
        const frontmatter = match[1];
        const content = markdown.slice(match[0].length).trim();
        return { frontmatter, content }
    }

    return { content: markdown }
}

function extractExcerpt(markdown, config) {
    /* 
        Extracts excerpt according to 'config.excerpt' (n):
        n = -1: Until '<!--more-->'
        n >  0: Amount of characters denoted by n 
        n =  0: Returns undefined
    */

    const delimiter = '<!--more-->'

    if (config.excerpt > 0) {
        return markdown.slice(0, config.excerpt) + '…'
    } else if (config.excerpt === -1) {
        return markdown.includes(delimiter) ? markdown.split(delimiter)[0] + '…' : undefined
    } else { 
        return undefined 
    }
}

export function parseMD(input, config) {
    /* Parses markdown file into object */
    const type = 'file';
    const ext = path.extname(input);
    const name = path.basename(input, ext);

    const file = fs.readFileSync(input, {encoding: 'utf-8'});
    let { frontmatter, content } = extractFrontmatter(file);
    
    const excerpt = extractExcerpt(content, config)

    frontmatter = frontmatter ? yaml.load(frontmatter) : undefined;
    content = config.content ? content : undefined


    return {
        type,
        ext,
        name,
        frontmatter,
        excerpt,
        content
    }
}