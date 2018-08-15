const assert = require('assert');
const main = require('../bin/cmd');

describe('Tests for the Passphrase Command', () => {

    it('Should execute a Passphrase Command but fail due to non integer length argument', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "passphrase",
            "dogecoin"
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.startsWith('USAGE'));
    });

    it('Should execute a Passphrase Command but fail due to no length argument present', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "passphrase",
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.startsWith('USAGE'));
    });

    it('Should execute a Passphrase Command but fail due to to much arguments specified', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "passphrase",
            "2",
            "Dogecoin"
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.startsWith('USAGE'));
    });

    it('Should execute a Passphrase Command and return a valid passphrase with 5 words', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "passphrase",
            "5"
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.length > 0);
    });
});