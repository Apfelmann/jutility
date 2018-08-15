const Command = require('./Command.js');
const PasswordGenerator = require('../PasswordGenerator');

class PasswordCommand extends Command {

    _validateOptions() {
        if (this.args.length <= 0) return false;
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
        return "USAGE: jutility password [length] [noNumbers] [noSymbols] [noUpper] [noSimilar]";
    }

    async _exec() {
        const numbers = this.args.indexOf("noNumbers") === -1;
        const symbols = this.args.indexOf("noSymbols") === -1;
        const uppercase = this.args.indexOf("noUpper") === -1;
        const excludeSimilarCharacters = this.args.indexOf("noSimilar") === -1;
        const opts = {
            length : this.args[0],
            numbers : numbers,
            uppercase : uppercase,
            symbols : symbols,
            excludeSimilarCharacters : excludeSimilarCharacters
        };
        return await PasswordGenerator.generate(opts);
    }
}

module.exports = PasswordCommand;