const Command = require('./Command');
const fs = require('fs');
const path = require('path');

class PassphraseCommand extends Command {

    static _getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
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
            const index = PassphraseCommand._getRandomInt(numOfWords);
            const word = words[index];
            phrase += word.charAt(0).toUpperCase() + word.substr(1);
        }
        return phrase;
    }
}

module.exports = PassphraseCommand;