const fs = require('fs');
const assert = require('assert');
const main = require('../bin/cmd');
const rimraf = require('rimraf');

const samplekey = "mBlk25rsddwiTwh94gFFn2K1bipnb3LT";
const sampleiv = "dXmiCK31zz6c4dEU";

let toBeRemoved = [];

describe('Tests for the Encryption Command', () => {
    beforeEach(() => {
        if( !fs.existsSync("tmp") ) fs.mkdirSync("tmp");
    });

    afterEach(() => {
        if( fs.existsSync("tmp") ) rimraf.sync('tmp');
        if( fs.existsSync("enc_tmp") ) rimraf.sync('enc_tmp');
        if( fs.existsSync("dec_tmp") ) rimraf.sync('dec_tmp');
        for(let r of toBeRemoved){
            if( fs.existsSync(r) ) rimraf.sync(r);
        }
        toBeRemoved = [];
    });

    it('Should fail because of missing arguments', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmp",
            samplekey
        ];
        process.argv = mockv;
        const result = await main();
        assert(result.startsWith('USAGE'));
    });

    it('Should fail because of a to short key', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmp",
            "abc",
            sampleiv
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

    it('Should fail because of a too long key', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmp",
            samplekey + "abc",
            sampleiv
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

    it('Should fail because of a too long iv', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmp",
            samplekey,
            sampleiv + "abc"
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

    it('Should fail because of a too short iv', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmp",
            samplekey,
            "abc"
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

    it('Should fail because the directory/file does not exist', async () => {
        const mockv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmpy",
            samplekey,
            sampleiv
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

    it('Should throw an error as a path instead of a single file/ directory is supplied as a argument', async () => {
        const plain = "This is a teststring";
        fs.writeFileSync("tmp/test.txt", plain);
        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmp/test.txt",
            samplekey,
            sampleiv
        ];
        let errored = false;
        try {
            await main();
        } catch (e) {
            assert(e);
            assert.strictEqual(e.message, "Please navigate to the file or folder you want to encrypt, paths are not allowed");
            errored = true;
        }
        assert(errored);
    });

    it('Should successfully encrypt a sample file', async () => {
        const plain = "This is a teststring";
        toBeRemoved.push("enc_test.txt");
        fs.writeFileSync("test.txt", plain);
        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "test.txt",
            samplekey,
            sampleiv
        ];
        await main();
        assert(fs.existsSync("enc_test.txt"));
        assert(!fs.existsSync("test.txt"));
        const text = fs.readFileSync("enc_test.txt", "UTF-8");
        assert.notStrictEqual(text, plain);
    });

    it('Should successfully encrypt a sample file and decrypt it again', async () => {
        const plain = "This is a teststring";
        const filename = "test.txt";
        toBeRemoved.push(filename);
        fs.writeFileSync(filename, plain);
        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            filename,
            samplekey,
            sampleiv
        ];
        await main();
        process.argv = [
            "node.exe",
            "cmd.js",
            "decrypt",
            "enc_" + filename,
            samplekey,
            sampleiv
        ];
        await main();
        assert(!fs.existsSync("enc_" + filename));
        assert(fs.existsSync(filename));
        const dec = fs.readFileSync(filename, "UTF-8");
        assert.strictEqual(dec, plain);
    });

    it('Should successfully encrypt a sample file and not be able to decrypt with a different key', async () => {
        const plain = "This is a teststring";
        const filename = "test.txt";
        toBeRemoved.push(filename);
        fs.writeFileSync(filename, plain);
        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            filename,
            samplekey,
            sampleiv
        ];
        await main();
        process.argv = [
            "node.exe",
            "cmd.js",
            "decrypt",
            "enc_" + filename,
            "mBlk25rsddwiTwh94gFFn2K1bipnb3Lt",
            sampleiv
        ];
        await main();
        assert(!fs.existsSync("enc_" + filename));
        assert(fs.existsSync(filename));
        const dec = fs.readFileSync(filename, "UTF-8");
        assert.notStrictEqual(dec, plain);
    });

    it('Should successfully encrypt a sample file and not be able to decrypt with a different IV', async () => {
        const plain = "This is a teststring";
        const filename = "test.txt";
        toBeRemoved.push(filename);
        fs.writeFileSync(filename, plain);
        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            filename,
            samplekey,
            sampleiv
        ];
        await main();
        process.argv = [
            "node.exe",
            "cmd.js",
            "decrypt",
            "enc_" + filename,
            samplekey,
            "dXmiCK31zz6c4dEu"
        ];
        await main();
        assert(!fs.existsSync("enc_" + filename));
        assert(fs.existsSync(filename));
        const dec = fs.readFileSync(filename, "UTF-8");
        assert.notStrictEqual(dec, plain);
    });

    it('Should be able to encrypt a file in a directory', async () => {
        const plain = "This is a teststring";
        fs.writeFileSync("tmp/test.txt", plain);
        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmp",
            samplekey,
            sampleiv
        ];
        await main();
        assert(!fs.existsSync("tmp"));
        assert(fs.existsSync("enc_tmp"));
        assert(fs.existsSync("enc_tmp/test.txt"));
        const enc = fs.readFileSync("enc_tmp/test.txt", "utf-8");
        assert.notStrictEqual(enc, plain)
    });

    it('Should be able to encrypt a file in a directory in another directory', async () => {
        const plain = "This is a teststring";
        fs.mkdirSync("tmp/tmp");
        fs.writeFileSync("tmp/tmp/test.txt", plain);
        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmp",
            samplekey,
            sampleiv
        ];
        await main();
        assert(!fs.existsSync("tmp"));
        assert(fs.existsSync("enc_tmp"));
        assert(fs.existsSync("enc_tmp/tmp/test.txt"));
        const enc = fs.readFileSync("enc_tmp/tmp/test.txt", "utf-8");
        assert.notStrictEqual(enc, plain);
    });

    it('Should be able to ecnrpyt a file in a driectory in another directory in another directory', async () => {
        const plain = "This is a teststring";
        fs.mkdirSync("tmp/tmp");
        fs.mkdirSync("tmp/tmp/tmp");
        fs.writeFileSync("tmp/tmp/tmp/test.txt", plain);
        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt",
            "tmp",
            samplekey,
            sampleiv
        ];
        await main();
        assert(!fs.existsSync("tmp"));
        assert(fs.existsSync("enc_tmp"));
        assert(fs.existsSync("enc_tmp/tmp/tmp/test.txt"));
        const enc = fs.readFileSync("enc_tmp/tmp/tmp/test.txt", "utf-8");
        assert.notStrictEqual(enc, plain);
    });

    it('Should throw and error when a path instead of a single file/directors is supplied', async () => {

    })
});