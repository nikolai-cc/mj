/*
    MJ 🕺 v0.0.1
    © 2021 Nikolai-cc
    Transforms a markdown file or a (nested) folder of markdown files into a JSON API.
*/

import fs from 'fs'

import parse from './parse.js'

export default function(
        input,
        output,
        {
            minify = false,          // minify output.json
            content = true,          // include the content of markdown files
            excerpt = 0,             // amount of characters. set to 0 for no preview. set to -1 for preview until <!--more-->
            extensions = ['.md'],    // array of extensions including dot
        } = {}
    ) {
    const config = { minify, content, excerpt, extensions }
    console.log('MJ 🕺 turns MD into JSON')
    console.log(config)
    
    let result = parse(input, config)
    result = JSON.stringify(result, false, config.minify ? 0 : 2)
    
    if (output) {
        const file = fs.openSync(output, 'w+');
        fs.writeSync(file, result);
    } else {
        return result
    }
    
    console.log('done')
}