const Command = require('./Command');
const fs = require('fs');
const path = require('path');
const randomNumber = require('random-number-csprng');

class PassphraseCommand extends Command {

    static _getRandomInt(max) {
        return new Promise((resolve, reject) => {
            randomNumber(0, max, (err, num) => {
                if ( err ) reject(err);
                else resolve(num);
            })
        });
    }

    _validateOptions() {
        if (this.args.length !== 1) return false;
        else {
            try {
                const len = parseInt(this.args[0]);
                return len > 0;
            } catch (e) {
                return false;
            }
        }
    }

    _usage() {
        return "USAGE: jutility passphrase [length]"
    }

    async _exec() {
        const words = fs.readFileSync(path.join(__dirname, '../../res/german.dic'), 'latin1').split('\r\n');
        const numOfWords = words.length;
        let phrase = "";
        for( let i = 0; i < this.args[0]; i++ ) {
            const index = await PassphraseCommand._getRandomInt(numOfWords);
            const word = words[index];
            phrase += word.charAt(0).toUpperCase() + word.substr(1);
        }
        return phrase;
    }
}

module.exports = PassphraseCommand;