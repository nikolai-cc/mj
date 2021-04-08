import path from 'path'
import fs from 'fs'

import { parseItem } from './parse.js'

export function parseDir(input, config) {
    /* 
        Parses directory file into object.
        It's contents are put in an array called "content" 
    */
    const type = 'dir';
    const name = path.basename(input);

    let content = [];

    const dir = fs.readdirSync(input);
    for (const item in dir) {
        parseItem(path.join(input, dir[item]), content, config);
    }

    return {
        type,
        name,
        content
    }
}