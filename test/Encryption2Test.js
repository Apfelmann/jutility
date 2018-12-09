const fs = require('fs');
const assert = require('assert');
const main = require('../bin/cmd');
const rimraf = require('rimraf');
const Util = require('../lib/Util');

const samplekey = "2bbbed0fc6dfe6fe9617221ab2cfb492793fdaf74b716fcbd061cbc751305ed9";
const sampleiv = "5e8e248eac045f247eb5d32cfc709070";

let toBeRemoved = [];

describe('Tests for the Encryption2 Command', () => {
    beforeEach(() => {
        if (!fs.existsSync("tmp")) fs.mkdirSync("tmp");
    });

    afterEach(() => {
        if (fs.existsSync("tmp")) rimraf.sync('tmp');
        if (fs.existsSync("enc_tmp")) rimraf.sync('enc_tmp');
        if (fs.existsSync("dec_tmp")) rimraf.sync('dec_tmp');
        for (let r of toBeRemoved) {
            if (fs.existsSync(r)) rimraf.sync(r);
        }
        toBeRemoved = [];
    });

    it('should fail because of internet not disconnected', async () => {
        const tmpfun = Util.getPasswordPromt;

        Util.getPasswordPromt = () => {
            return {
                inetoff : "n",
                iv: sampleiv,
                key: samplekey
            }
        };

        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt2",
            "tmp",
        ];
        let errored = false;
        try {
            await main();
        } catch (e) {
            errored = true
        }
        assert(errored);

        Util.getPasswordPromt = tmpfun;
    });

    it('Should successfully encrypt a sample file and decrypt it again', async () => {
        const tmpfun = Util.getPasswordPromt;

        Util.getPasswordPromt = () => {
            return {
                inetoff : "y",
                iv: sampleiv,
                key: samplekey
            }
        };

        const plain = "This is a teststring";
        const filename = "test.txt";
        toBeRemoved.push(filename);
        fs.writeFileSync(filename, plain);
        process.argv = [
            "node.exe",
            "cmd.js",
            "encrypt2",
            filename,
        ];
        await main();
        process.argv = [
            "node.exe",
            "cmd.js",
            "decrypt2",
            "enc_" + filename,
        ];
        await main();
        Util.getPasswordPromt = tmpfun;

        assert(!fs.existsSync("enc_" + filename));
        assert(fs.existsSync(filename));
        const dec = fs.readFileSync(filename, "UTF-8");
        assert.strictEqual(dec, plain);
    });
});
