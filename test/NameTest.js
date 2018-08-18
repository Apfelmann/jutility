const assert = require('assert');
const main = require('../bin/cmd');

describe("Tests for the Name Command", () => {

    it('Should generate a Random name consisting of a first and lastname', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "name",
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.length > 0);
        assert.strictEqual(result.match(/\s/g).length, 1);
    });

    it('Should generate a Random name consisting of a first and lastname uppercase command', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "NAME",
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.length > 0);
        assert.strictEqual(result.match(/\s/g).length, 1);
    });

    it('Should generate a Random name consisting of a first and lastname Capital command', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "Name",
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.length > 0);
        assert.strictEqual(result.match(/\s/g).length, 1);
    });

    it('Should fail because unknown arguments where given to the command', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "name",
            "dogecoin"
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.startsWith("USAGE"));
    })

});