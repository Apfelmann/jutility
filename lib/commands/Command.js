class Command {

    constructor(args) {
        this.args = args;
    }

    /**
     * Execute the command
     * @return {string} Result
     */
    async execute() {
        const valid = this._validateOptions();
        if( !valid ) { return this._usage(); }
        else { return await this._exec(); }
    }

    /**
     * Validate if all required arguments for the command are present
     * @return {boolean} will return true if all are present else false
     */
    _validateOptions() {
        return false;
    }

    /**
     * Print usage string of the command
     * @return {string}
     */
    _usage() {
        throw new Error("Usage not implemented");
    }

    /**
     * Actual execution, should be implemented in a subtype
     * @private
     */
    async _exec () {
        throw new Error("Exec not implemented");
    }
}

module.exports = Command;