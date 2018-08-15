const mocha = require('mocha');
const assert = require('assert');
const main = require('../bin/cmd');
const CommandFactory = require('../lib/CommandFactory');

describe("Tests for the Password Command", () => {

    it('Should execute a PasswordCommand but fail due to non integer length argument', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "password",
            "dogecoin"
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.startsWith('USAGE'));
    });

    it('Should execute a PasswordCommand and return a valid password', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "password",
            "44"
        ];
        process.argv = mockv;
        const result = await main();
        assert(!result.startsWith('USAGE'));
        assert.strictEqual(result.length, 44);
    });

    it('Should execute a PasswordCommand and return a valid password for upper and lower case type', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "paSsWord",
            "44"
        ];
        process.argv = mockv;
        const result = await main();
        assert(!result.startsWith('USAGE'));
        assert.strictEqual(result.length, 44);
    });

    it('Should execute a PasswordCommand two times and verify that the passwords are not the same', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "paSsWord",
            "444"
        ];
        process.argv = mockv;
        const pw1 = await main();
        const pw2 = await main();
    });

    it('Should execute a PasswordCommand with noSymbols option', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "password",
            "10000",
            "noSymbols"
        ];
        process.argv = mockv;
        const result = await main();
        assert(!result.startsWith('USAGE'));
        assert.strictEqual(result.length, 10000);
        assert(/^[a-zA-Z\d]*/.test(result));
    });

    it('Should generate a Password without numbers', async () => {
        const cmd = CommandFactory.generateCommand("password",[10000, "noNumbers"]);
        const r = await cmd.execute();
        assert.strictEqual(r.length, 10000);
        assert(/[^\d]*/.test(r));
    });

    it('Should generate a Passwort without uppercase Characters', async  () => {
        const cmd = CommandFactory.generateCommand("password",[10000, "noUpper"]);
        const r = await cmd.execute();
        assert.strictEqual(r.length, 10000);
        assert(/^[A-Z]*/.test(r));
    });

    it('Should generate a Password without uppercase Characters and numbers', async  () => {
        const cmd = CommandFactory.generateCommand("password",[10000, "noUpper", "noNumbers"]);
        const r = await cmd.execute();
        assert.strictEqual(r.length, 10000);
        assert(/^[A-Z\d]*/.test(r));
    });

    it('Should generate a Password without similiar characers', async () => {
        const cmd = CommandFactory.generateCommand("password",[10000, "noSimiliar"]);
        const r = await cmd.execute();
        assert.strictEqual(r.length, 10000);
        assert(/^[iIlLoO0]*/.test(r));
    })
});