const misc = require('../../modules/miscModule.js');
const fetch = require('node-fetch');
module.exports = {
    run: async (msg, args) => {
        const user = misc.getUserFromMSG(msg, args[0]);
        if (!user) return msg.channel.send(':x: Invalid user!');
        if (!args[1]) return msg.channel.send(':x: Please give a cost of the order!');
        const cost = parseInt(args[1], 10);
        const data4api = {
            requestor: user.tag,
            cost: cost,
            channel: msg.channel.id
        }
        const apifetch = await fetch(`${client.config.api.base}/payments/create`, {
            method: "POST",
            body: JSON.stringify(data4api),
            headers: {
                "Content-Type": "application/json",
                "Authorization": client.config.api.key
            }
        });
        const res = await apifetch.json();
        if (res.error == false) {
            msg.channel.send(`:white_check_mark: ${client.config.api.base}/payments/cont/${res.id}`);
        } else {
            msg.channel.send(`:x: There was an API error! **[API: ${res.type}]**`)
        }
    },
    meta: {
        aliases: ['pay'],
        permlvl: 2
    }
}