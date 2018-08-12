const mocha = require('mocha');
const assert = require('assert');
const main = require('../bin/cmd');

describe("General tests for the bin file", () => {
    it('Should fail when the type of the command is not specified', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
        ];
        process.argv = mockv;
        let errored = false;
        try {
            await main();
        } catch (e) {
            assert(e);
            errored = true;
        }
        assert(errored);
    });

    it('Should fail when the type of the command is invalid', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "dogecoin"
        ];
        process.argv = mockv;
        let errored = false;
        try {
            await main();
        } catch (e) {
            assert(e);
            errored = true;
        }
        assert(errored);
    });

    it('Should execute a PasswordCommand but fail due to missing arguments', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "password"
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.startsWith('USAGE'));
    });
});