const misc = require('../../modules/miscModule.js');
module.exports = {
    run: async (msg, args) => {
        let proceed = false;
        const awaitM = async () => {
            const filter = m =>  m.author.id === msg.author.id;
            const msgawait = msg.author.dmChannel.awaitMessages(filter, { max: 1, time: 60000 * 5, errors: ['time'] });
            return msgawait;
        }
        let m;
        const customer = msg.guild.roles.find(r => r.name === 'Customer');
        if (!msg.member.roles.has(customer.id)) {
            await msg.author.createDM();
            msg.author.send(misc.firstTimeMSG).catch(async () => {
                const delmsg = await msg.channel.send(':x: Please enable direct messages in order to use this service!');
                setTimeout(() => {
                    msg.delete();
                    delmsg.delete();
                }, 7000);
            });
            msg.delete();
            m = await awaitM(); if (m.first().content.toLowerCase() == 'continue') {
                proceed = true;            
            } else if (m.first().content.toLowerCase() == 'cancel') return m.first().react('👌');
        } else proceed = true;
        if (proceed == true) {
            const channel = await msg.guild.createChannel(`order-${await misc.intByOneInDB('tickets')}`, { type: 'text', parent: client.config.ordercat, permissionOverwrites: [{ deny: 'VIEW_CHANNEL', id: client.config.everyonerole }, { allow: 'VIEW_CHANNEL', id: client.config.employeerole }, { allow: 'VIEW_CHANNEL', id: msg.author.id }, { allow: 'VIEW_CHANNEL', id: client.user.id }] });
            await msg.guild.roles.get(client.config.employeerole).setMentionable(true);
            await channel.send(`<@&${client.config.employeerole}>\n\nThe employees that are online will get to your order. Please note that our hours of operation are **12PM** to **6PM EST**. If you've ordered before or after that, please cancel your order with \`!cancel\` in this channel.`);
            await msg.guild.roles.get(client.config.employeerole).setMentionable(false);
        }
    },
    meta: {
        aliases: ['order'],
        permlvl: 0
    }
}