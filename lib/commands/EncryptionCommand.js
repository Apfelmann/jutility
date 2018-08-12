const Command = require('./Command');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const fs = require('fs');
const path = require('path');

class EncryptionCommand extends Command {

    constructor(args, mode) {
        super(args);
        this.mode = mode.toUpperCase();
    }

    async execute() {
        return super.execute();
    }

    _validateOptions() {
        if( this.mode !== "DECRYPT" && this.mode !== "ENCRYPT" ) return false;
        if( this.args.length !== 3 ) return false;
        if( this.args[0].length <= 0 || typeof this.args[0] !== "string"
            || this.args[1].length <= 0 || typeof this.args[1] !== "string"
            || this.args[2].length <= 0 || typeof this.args[2] !== "string" ) return false;
        return true;
    }

    _usage() {
        return "USAGE: jutility [ENCRYPT|DECRYPT] [FOLDER_PATH] [KEY] [IV]"
    }

    async _exec() {
        let key = Buffer.from(this.args[1], 'utf-8');
        let iv = Buffer.from(this.args[2], 'utf-8');
        if( iv.length < 16 ) throw new Error("IV needs to be at least 16 bytes long");
        if( key.length < 32 ) throw new Error("KEY needs to be at least 32 bytes long");
        if( key.length > 32 ) key.slice(0, 32);
        if( iv.length > 16 ) key.slice(0, 16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        const dir = this.args[0];
        if( !fs.existsSync(dir ) ) throw new Error("Directory or file does not exist");
        this._cryption("", dir, cipher);
        return "DONE";
    }

    _cryption(rootDir, filenameOrDirname, cipher) {
        const pathToFile = rootDir !== '' ? rootDir + "/" + filenameOrDirname : filenameOrDirname;
        const stat = fs.lstatSync(pathToFile);
        if( stat.isDirectory() ) {
            const filesInDir = fs.readdirSync(filenameOrDirname);
            for( let file of filesInDir ) {
                const newRootDir = rootDir === '' ? filenameOrDirname : rootDir + "/" + filenameOrDirname;
                this._cryption(filenameOrDirname, file, cipher);
                fs.unlinkSync(filenameOrDirname);
            }
        }
        else if( stat.isFile() ) {
            const file = fs.readFileSync(rootDir + "/" + filenameOrDirname);
            let outputdir = "";
            switch (this.mode) {
                case "ENCRYPT":
                    const encrypted = EncryptionCommand.encrypt(cipher, file);
                    outputdir = rootDir.length > 0 ? "enc_" + rootDir : "enc";
                    if( !fs.existsSync(outputdir) ) { fs.mkdirSync(outputdir); }
                    fs.writeFileSync(outputdir + filenameOrDirname, encrypted);
                    fs.unlinkSync(rootDir + filenameOrDirname);
                    break;
                case "DECRYPT":
                    const decrypted = EncryptionCommand.decrypt(cipher, file);
                    outputdir =
                        rootDir.length > 4
                            ? rootDir.substr(4)
                            : "dec";
                    if( !fs.existsSync(outputdir) ) { fs.mkdirSync(outputdir); }
                    fs.writeFileSync(outputdir + filenameOrDirname, decrypted);
                    fs.unlinkSync(rootDir + filenameOrDirname);
                    break;
                default:
                    throw new Error("Unsupported mode " + this.mode);
            }
        }
    }

    static encrypt(cipher, buffer) {
        return Buffer.concat([cipher.update(buffer),cipher.final()]);
    }

    static decrypt(decipher, buffer) {
        return Buffer.concat([decipher.update(buffer) , decipher.final()]);
    }
}

module.exports = EncryptionCommand;