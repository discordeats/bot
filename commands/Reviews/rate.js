const { RichEmbed } = require('discord.js');
module.exports = {
    run: async (msg, args) => {
        const awaitM = async () => {
            const filter = m =>  m.author.id === msg.author.id;
            const msgawait = msg.author.dmChannel.awaitMessages(filter, { max: 1, time: 60000 * 5, errors: ['time'] });
            return msgawait;
        }
        if (!args[0]) return msg.channel.send(':x: You must specify the ID of your order!');
        const order = await client.db.table('orders').get(args[0]).run();
        if (!order) return msg.channel.send(':x: No order can be found under that ID!');
        if (order.status == 'PENDING') return msg.channel.send(':x: You cannot review an order that hasn\'t been completed!');
        if (order.requestor.id != msg.author.id) return msg.channel.send(':x: You are not the requestor of this order!');
        if (order.reviewed == true) return msg.channel.send(':x: You already reviewed this order!');
        if (!msg.author.dmChannel) await msg.author.createDM();
        msg.author.send('Welcome to the review! Firstly, please rate your order based on a scale of 1-5.').catch(() => {
            msg.channel.send(':x: You must have your DMs open to review this service!');
        });
        m = await awaitM(); 
        if (isNaN(m.first().content)) return msg.author.send(':x: Your rating must be a number!');
        const rating = parseInt(m.first().content, 10);
        const ifbetween = rating > 0 && rating < 6;
        if (ifbetween == false) return msg.author.send(':x: Your rating must be in between 1 and 5!');
        msg.author.send('Great! Now that we got your rating, do you have any comments? If so, please type them out here, if not just type `no`.');
        let comments = 'None';
        m = await awaitM(); 
        if (m.first().content.toLowerCase() != 'no') comments = m.first().content;
        const embed = new RichEmbed()
        .setDescription(`**${msg.author.tag}** has reviewed Discord Eats and their review is currently pending!`)
        .addField('Star Rating', `${rating}/5`)
        .addField('Comments', comments)
        .setThumbnail(msg.author.avatarURL)
        .setFooter(`Accept or deny it with !reviews accept ${order.id} or !reviews deny ${order.id}`);
        const approvalmsg = await client.channels.get(client.config.reviewqueue).send(embed);
        await client.db.table('orders').get(order.id).update({ reviewed: true, review: { rating: rating, comments: comments, status: 'PENDING', msgid: approvalmsg.id } }).run();
        msg.author.send(':white_check_mark: Your review has been submitted to the staff team for approval!');
    },
    meta: {
        aliases: ['rate'],
        permlvl: 0
    }
}