'use strict';

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var yaml__default = /*#__PURE__*/_interopDefaultLegacy(yaml);

function parseDir(input, config) {
    /* 
        Parses directory file into object.
        It's contents are put in an array called "content" 
    */
    const type = 'dir';
    const name = path__default['default'].basename(input);

    let content = [];

    const dir = fs__default['default'].readdirSync(input);
    for (const item in dir) {
        parseItem(path__default['default'].join(input, dir[item]), content, config);
    }

    return {
        type,
        name,
        content
    }
}

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

    const delimiter = '<!--more-->';

    if (config.excerpt > 0) {
        return markdown.slice(0, config.excerpt) + '…'
    } else if (config.excerpt === -1) {
        return markdown.includes(delimiter) ? markdown.split(delimiter)[0] + '…' : undefined
    } else { 
        return undefined 
    }
}

function parseMD(input, config) {
    /* Parses markdown file into object */
    const type = 'file';
    const ext = path__default['default'].extname(input);
    const name = path__default['default'].basename(input, ext);

    const file = fs__default['default'].readFileSync(input, {encoding: 'utf-8'});
    let { frontmatter, content } = extractFrontmatter(file);
    
    const excerpt = extractExcerpt(content, config);

    frontmatter = frontmatter ? yaml__default['default'].load(frontmatter) : undefined;
    content = config.content ? content : undefined;


    return {
        type,
        ext,
        name,
        frontmatter,
        excerpt,
        content
    }
}

function parse(input, config) {
    console.log("parsing", input, "with", config);

    let content = [];
    
    parseItem(input, content, config);

    return content
}

function isValidInput(input) {
    return fs__default['default'].existsSync(input)
}

function isDirectory(input) {
    return fs__default['default'].lstatSync(input).isDirectory()
}

function isSupportedFileType(input, config) {
    return fs__default['default'].lstatSync(input).isFile() && config.extensions.includes(path__default['default'].extname(input))
}

function parseItem(input, content, config) {
    if (isValidInput(input)) {
        if (isDirectory(input)) {
            console.log(input, "is a directory");
            content.push(parseDir(input, config));
        } else if (isSupportedFileType(input, config)) {
            console.log(input, "is markdown");
            content.push(parseMD(input, config));
        } else {
            console.log("skipping", input);
        }
    } else {
        console.log(input, "does not exist");
    }
}

/*
    MJ 🕺 v0.0.1
    © 2021 Nikolai-cc
    Transforms a markdown file or a (nested) folder of markdown files into a JSON API.
*/

function mj(
        input,
        output,
        {
            minify = false,          // minify output.json
            content = true,          // include the content of markdown files
            excerpt = 0,             // amount of characters. set to 0 for no preview. set to -1 for preview until <!--more-->
            extensions = ['.md'],    // array of extensions including dot
        } = {}
    ) {
    const config = { minify, content, excerpt, extensions };
    console.log('MJ 🕺 turns MD into JSON');
    console.log(config);
    
    let result = parse(input, config);
    result = JSON.stringify(result, false, config.minify ? 0 : 2);
    
    if (output) {
        const file = fs__default['default'].openSync(output, 'w+');
        fs__default['default'].writeSync(file, result);
    } else {
        return result
    }
    
    console.log('done');
}

module.exports = mj;
