const read = require('fs-readdir-recursive');
const misc = require('./miscModule.js');

module.exports = async (msg) => {
    const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    try {
        const files = read('commands');
        files.forEach(file => {
            const meta = require('../commands/' + file).meta;
            if (meta.aliases.includes(command)) {
                const permlvl = misc.elevation(msg);
                if (meta.permlvl > permlvl) return;
                return require('../commands/' + file).run(msg, args);
            }
        });
    } catch (err) {
        console.error(err);
    }
}