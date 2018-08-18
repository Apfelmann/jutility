const Command = require('./Command');
const fs = require('fs');
const path = require('path');
const Util = require('../Util');

class NameCommand extends Command {

    _validateOptions() {
        return this.args.length === 0;
    }

    _usage() {
        return "USAGE: jutility name";
    }

    async _exec() {
        const firstNames = fs.readFileSync(path.join(__dirname, '../../res/fnames.dic'), 'utf-8').split('\r\n');
        const lastNames = fs.readFileSync(path.join(__dirname, '../../res/lnames.dic'), 'utf-8').split('\r');

        const numOfFirstNames = firstNames.length;
        const numOfLastNames = lastNames.length;

        try {
            const indexFirstNames = await Util.getRandomNum(numOfFirstNames -1);
            const indexLastNames = await Util.getRandomNum(numOfLastNames -1);

            return `${firstNames[indexFirstNames]} ${lastNames[indexLastNames]}`;
        } catch (e) {
            return "Error appeared " + e.message;
        }
    }
}

module.exports = NameCommand;