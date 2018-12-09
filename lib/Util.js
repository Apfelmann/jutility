const randomNumber = require('random-number-csprng');
const prompt = require('prompt');
const schema = {
    properties: {
        inetoff: {
            description: 'Is your internet turned off? [y/n]',
            required: true
        },
        iv: {
            description: 'Provide a hex encoded initialization vector. [16 bytes]',
            message: 'Invalid Input',
            pattern: /[0-9a-fA-F]{32}/,
            required: true
        },
        key: {
            description: 'Provide a hex encoded key. [32 bytes]',
            message: 'invalid Input',
            pattern: /[0-9a-fA-F]{64}/,
            required: true,
            hidden: true
        }
    }
};

class Util {

    static getRandomNum(max) {
        return new Promise((resolve, reject) => {
            randomNumber(0, max, (err, num) => {
                if (err) reject(err);
                else resolve(num);
            })
        })
    }

    /**
     * Get some command line input from user
     * @return {Promise<object>}
     */
    static getPasswordPromt() {
        return new Promise((resolve, reject) => {
            prompt.get(schema, (err, result) => {
                if (err) throw reject(new Error("Error during reading command line input"));
                else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Util;