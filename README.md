# MJ 🕺 turns MD into JSON

MJ 🕺 turns a single markdown file or a folder full of Markdown files into a JSON api.

Installation:

`npm install @nikolai-cc/mj`

Usage:

`mj('path/to/input', ['path/to/output.json'], [config])`

```javascript

import mj from '@nikolai-cc/mj'

const input = 'path/to/input'
const output = undefined
const config = {               // these are the default values
    minify = false,          // minify output.json
    content = true,          // include the content of markdown files under 'content'
    excerpt = 0,             // amount of characters. set to 0 for no preview. set to -1 for preview until <!--more-->
    extensions = ['.md'],    // array of extensions including dot
}

const result = mj(input, output, config)
/*[{
    "type": "dir",
    "name": "data",
    "content": [{
        "type": "file",
        "ext": "md",
        "name": "markdown file",
        "frontmatter": {
            "name": "MJ 🕺"
            "occupation": "turning markdown into json"
        },
        "content": "Hello, World!"
    }]
}]*/
```
