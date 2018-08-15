const Command = require('./Command');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const fs = require('fs');
const path = require('path');

class EncryptionCommand extends Command {

    constructor(args, mode) {
        super(args);
        this.mode = mode.toUpperCase();
        this.basepath = process.cwd();
    }

    async execute() {
        return super.execute();
    }

    _validateOptions() {
        if( this.mode !== "DECRYPT" && this.mode !== "ENCRYPT" ) return false;
        if( this.args.length !== 3 ) return false;
        return !(this.args[0].length <= 0 || typeof this.args[0] !== "string"
            || this.args[1].length <= 0 || typeof this.args[1] !== "string"
            || this.args[2].length <= 0 || typeof this.args[2] !== "string");

    }

    _usage() {
        return "USAGE: jutility [ENCRYPT|DECRYPT] [PATH] [KEY] [IV]"
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
        if( !fs.existsSync(dir) ) throw new Error("Directory or file does not exist");
        this._cryption("", dir, cipher);
        return "DONE";
    }

    _cryption(rootDir, filenameOrDirname, cipher) {
        const pathToFile = rootDir !== '' ? this._getAbsolutePath(rootDir + "/" + filenameOrDirname) : this._getAbsolutePath(filenameOrDirname);
        let stat = fs.lstatSync(pathToFile);
        if( stat.isDirectory() ) {
            // If it's a directory, get all files in the directory and execute recursively
            const filesInDir = fs.readdirSync(filenameOrDirname);
            const newRootDir = rootDir === '' ? filenameOrDirname : rootDir + "/" + filenameOrDirname;
            for( let file of filesInDir ) {
                this._cryption(newRootDir, file, cipher);
            }
        }
        else if( stat.isFile() ) {
            // If it's a file we read it's content and encrypt it with the cipher
            const file = fs.readFileSync(pathToFile);
            let outputdir = "";
            switch (this.mode) {
                case "ENCRYPT":
                    const encrypted = EncryptionCommand.encrypt(cipher, file);
                    if( rootDir.length > 0 ) {
                        outputdir = rootDir;
                        if( outputdir.startsWith("dec_") ) { outputdir = outputdir.substr(4) }
                        outputdir = "enc_" + outputdir;
                        if( !fs.existsSync(this._getAbsolutePath(outputdir)) ) fs.mkdirSync(outputdir);
                        fs.writeFileSync(this._getAbsolutePath(outputdir + "/" + filenameOrDirname), encrypted);
                        fs.unlinkSync(this._getAbsolutePath(rootDir + "/" + filenameOrDirname));
                    }
                    else {
                        fs.writeFileSync(this._getAbsolutePath("enc_" + filenameOrDirname), encrypted);
                        fs.unlinkSync(this._getAbsolutePath(filenameOrDirname));
                    }
                    break;
                case "DECRYPT":
                    const decrypted = EncryptionCommand.decrypt(cipher, file);
                    if( rootDir.length > 0 ) {
                        outputdir = rootDir;
                        if( outputdir.startsWith("enc_") ) { outputdir = outputdir.substr(4) }
                        else outputdir = "dec_" + outputdir;
                        if( !fs.existsSync(this._getAbsolutePath(outputdir)) ) fs.mkdirSync(outputdir);
                        fs.writeFileSync(this._getAbsolutePath(outputdir + "/" + filenameOrDirname), decrypted);
                        // Clean up the encrypted file
                        fs.unlinkSync(this._getAbsolutePath(rootDir + "/" + filenameOrDirname));
                    }
                    else {
                        fs.writeFileSync(this._getAbsolutePath("dec_" + filenameOrDirname), decrypted);
                        fs.unlinkSync(this._getAbsolutePath(filenameOrDirname));
                    }
                    break;
                default:
                    throw new Error("Unsupported mode " + this.mode);
            }
        }
    }

    /**
     * Get the absolute path to a file or directory
     * @param dir the relative path
     * @return {string}
     * @private
     */
    _getAbsolutePath(dir) {
        return EncryptionCommand._normalizePath(this.basepath, false, true) + "/" + EncryptionCommand._normalizePath(dir, true, true);
    }

    static _normalizePath(str, start, end) {
        if( start ) {
            while(str.charAt(0) === "/") {
                str = str.substring(1);
            }
        }
        if( end ) {
            while(str.charAt(str.length-1) === "/") {
                str = str.substring(0,str.length-1);
            }
        }
        return str;
    }

    static encrypt(cipher, buffer) {
        return Buffer.concat([cipher.update(buffer),cipher.final()]);
    }

    static decrypt(decipher, buffer) {
        return Buffer.concat([decipher.update(buffer) , decipher.final()]);
    }
}

module.exports = EncryptionCommand;