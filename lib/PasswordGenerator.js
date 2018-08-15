const randomNumber = require('random-number-csprng');
const lowercase = 'abcdefghijklmnopqrstuvwxyz',
    uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers = '0123456789',
    symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~',
    similarCharacters = /[ilLI|`oO0]/g,
    strictRules = [
        { name: 'lowercase', rule: /[a-z]/ },
        { name: 'uppercase', rule: /[A-Z]/ },
        { name: 'numbers', rule: /[0-9]/ },
        { name: 'symbols', rule: /[!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~]/ }
    ];

class PasswordGenerator {

    static getRandomNum(max) {
        return new Promise((resolve, reject) => {
            randomNumber(0, max, (err, num) => {
                if( err ) reject(err);
                else resolve(num);
            })
        })
    }

    static async generate(options) {
        options = options || {};
        if (!options.hasOwnProperty('length')) options.length = 10;
        if (!options.hasOwnProperty('numbers')) options.numbers = true;
        if (!options.hasOwnProperty('symbols')) options.symbols = true;
        if (!options.hasOwnProperty('uppercase')) options.uppercase = true;
        if (!options.hasOwnProperty('excludeSimilarCharacters')) options.excludeSimilarCharacters = false;

        let pool = lowercase;

        if( options.uppercase ) pool += uppercase;
        if( options.numbers ) pool += numbers;
        if( options.symbols ) pool += symbols;
        if( options.excludeSimilarCharacters ) pool.replace(similarCharacters, '');

        try {
            const length = parseInt(options.length);
            let pw = "";
            for( let i = 0; i < length; i++ ) {
                const ransome = await this.getRandomNum(pool.length -1);
                pw += pool[ransome];
            }
            return pw;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = PasswordGenerator;