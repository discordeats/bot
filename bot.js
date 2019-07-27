const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const fs = require('fs');

client.config = require('./config.json');
client.db = require('rethinkdbdash')({ db: 'discordeats' });
client.login(client.config.token);

fs.readdir('events', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require('./events/' + file);
        let eventName = file.split('.')[0];
        client.on(eventName, (...args) => eventFunction(...args));
    });
});

client.on('warn', e => {
    console.log('that was redacted');
});
  
client.on('error', e => {
    console.log('that was redacted');
});
  
global.client = client;