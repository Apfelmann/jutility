const fs = require('fs');

const Util = require('../Util');
const EncryptionCommand = require('./EncryptionCommand');

class Encryption2Command extends EncryptionCommand {

    _validateOptions() {
        if( this.mode !== "DECRYPT" && this.mode !== "ENCRYPT" ) return false;
        if( this.args.length !== 1 ) return false;
        return !this.args[0].length <= 0 || typeof this.args[0] !== "string";
    }

    _usage() {
        return "USAGE: jutility [ENCRYPT2|DECRYPT2] [PATH]";
    }

    async _exec() {
        const result = await Util.getPasswordPromt();
        const inet = result.inetoff;
        const iv = Buffer.from(result.iv, 'hex');
        const key = Buffer.from(result.key, 'hex');
        if( inet !== 'y' ) { reject(new Error("Please turn of your internet when decrypting")); }
        else {
            const dir = EncryptionCommand._normalizePath(this.args[0], false, true);
            if( dir.indexOf("/") !== -1 || dir.indexOf("\\") !== -1 ) throw new Error("Please navigate to the file or folder you want to encrypt, paths are not allowed");

            if( !fs.existsSync(dir) ) throw new Error("Directory or file does not exist");
            this._cryption("", dir, key, iv);
            return "DONE";
        }
    }
}

module.exports = Encryption2Command;