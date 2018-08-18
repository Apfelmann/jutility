const randomNumber = require('random-number-csprng');

class Util {

    static getRandomNum(max) {
        return new Promise((resolve, reject) => {
            randomNumber(0, max, (err, num) => {
                if( err ) reject(err);
                else resolve(num);
            })
        })
    }
}

module.exports = Util;