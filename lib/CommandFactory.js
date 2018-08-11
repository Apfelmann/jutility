const PasswordCommand = require('./commands/PasswordCommand');

class CommandFactory {

    /**
     * Create a command object to be executed
     *
     * @param type {string} can be either crypto | password | passphrase | username
     * @param args {[]} series of options passed to the command
     * @return {Command}
     */
    static generateCommand(type, args) {
        switch (type.toUpperCase()) {
            case "PASSWORD" :
                return new PasswordCommand(args);
            default:
                throw new Error(type + " is not a valid command type");
        }
    }
}

module.exports = CommandFactory;