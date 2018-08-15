#!/usr/bin/env node

const CommandFactory = require('../lib/CommandFactory');

module.exports = main = async () => {
    if( process.argv.length < 3 ) { throw  new Error("At least one argument is expected") }
    else {
        const cmdtype = process.argv[2];
        const args = [];
        for( let i = 3; i < process.argv.length; i++ ) {
            const a = process.argv[i];
            args.push(a);
        }
        const cmd = CommandFactory.generateCommand(cmdtype, args);
        return await cmd.execute();
    }
};

main().then((r) => {
    console.log(r);
}).catch( e => {
    console.error("An error has occured " + e.message);
});