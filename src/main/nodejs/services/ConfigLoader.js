//@flow
'use strict';

const fs = require('fs');

class ConfigLoader {

    static load(name: string): AppConfig {
        return require(__dirname + '/../config/app.' + name + '.config.js');
    }

    static configExists(name: string): boolean {
        return fs.existsSync(__dirname + '/../config/app.' + name + '.config.js');
    }

}

module.exports = ConfigLoader;
