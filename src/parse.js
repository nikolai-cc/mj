import path from 'path'
import fs from 'fs'

import { parseDir } from './parseDir.js'
import { parseMD } from './parseMD.js'

export default function parse(input, config) {
    console.log("parsing", input, "with", config)

    let content = []
    
    parseItem(input, content, config)

    return content
}

function isValidInput(input) {
    return fs.existsSync(input)
}

function isDirectory(input) {
    return fs.lstatSync(input).isDirectory()
}

function isSupportedFileType(input, config) {
    return fs.lstatSync(input).isFile() && config.extensions.includes(path.extname(input))
}

export function parseItem(input, content, config) {
    if (isValidInput(input)) {
        if (isDirectory(input)) {
            console.log(input, "is a directory")
            content.push(parseDir(input, config))
        } else if (isSupportedFileType(input, config)) {
            console.log(input, "is markdown")
            content.push(parseMD(input, config))
        } else {
            console.log("skipping", input)
        }
    } else {
        console.log(input, "does not exist")
    }
}