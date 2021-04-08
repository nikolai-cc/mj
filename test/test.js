import { expect } from 'chai'
import fs from 'fs'
import mj from '../src/mj.js'

let config = {
    minify: false,
    content: true,
    excerpt: -1,
    extensions: [
        ".md",
        ".markdown",
    ],
}

describe('🕺  MJ', () => {

    let result, correct_result

    before(() => {
        result = mj('./test/fixtures/data', undefined, config)
        correct_result = fs.readFileSync('./test/fixtures/output.json', 'utf-8')
    })

    it('🌍 The world should be full of love', () => {
        expect(result).to.equal(correct_result)
    })
})