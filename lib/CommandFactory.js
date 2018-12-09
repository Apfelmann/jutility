const PasswordCommand = require('./commands/PasswordCommand');
const PassPhraseCommand = require('./commands/PassphraseCommand');
const EncryptionCommand = require('./commands/EncryptionCommand');
const Encryption2Command = require('./commands/Encryption2Command');
const NameCommand = require('./commands/NameCommand');

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
            case "PASSPHRASE" :
                return new PassPhraseCommand(args);
            case "ENCRYPT" :
                return new EncryptionCommand(args, "ENCRYPT");
            case "DECRYPT":
                return new EncryptionCommand(args, "DECRYPT");
            case "NAME":
                return new NameCommand(args);
            case "ENCRYPT2":
                return new Encryption2Command(args, "ENCRYPT");
            case "DECRYPT2":
                return new Encryption2Command(args, "DECRYPT");
            default:
                throw new Error(type + " is not a valid command type");
        }
    }
}

module.exports = CommandFactory;