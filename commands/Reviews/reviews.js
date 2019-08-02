const { RichEmbed } = require('discord.js');
const misc = require('../../modules/miscModule.js');
module.exports = {
    run: async (msg, args) => {
        if (!args[0]) return msg.channel.send(`:x: Invalid args! Usage: \`${this.meta.usage}\``);
        if (args[0] == 'accept') {
            if (!args[1]) return msg.channel.send(':x: You must include an ID to accept!');
            const order = await client.db.table('orders').get(args[1]).run();
            if (!order) return msg.channel.send(':x: Invalid ID!');
            const member = (await msg.guild.fetchMembers()).members.get(order.requestor.id);
            let reason = 'None';
            if (args[2]) reason = args.slice(2).join(' ');
            const approvalchannel = client.channels.get(client.config.reviewqueue);
            const approvalmsg = await approvalchannel.fetchMessage(order.review.msgid);
            const embed = new RichEmbed()
            .setDescription(`**${order.requestor.tag}** has reviewed Discord Eats and their review has been accepted!`)
            .addField('Star Rating', `${order.review.rating}/5`)
            .addField('Comments', order.review.rating.comments)
            .setThumbnail(msg.author.avatarURL)
            .setColor('GREEN')
            .setFooter(`Accepted by ${msg.author.tag} | Reason: ${reason}`);
            approvalmsg.edit(embed);
            await client.db.table('orders').get(order.id).update({ review: { status: 'ACCEPTED', reason: reason } }).run();
            const meanstars = await misc.getMeanStars();
            const content = misc.reviewMSG(meanstars, order);
            const reviewchannel = client.channels.get(client.config.reviewchannel);
            const reviewstatsid = await client.db.table('miscData').get('reviewstats').run();
            if (!reviewstatsid) {
                const reviewstatsmsg = await reviewchannel.send(content);
                await client.db.table('miscData').insert({ id: 'reviewstats', msg: reviewstatsmsg.id }).run();
            } else {
                const reviewstatsmsg = await reviewchannel.fetchMessage(reviewstatsid.msg);
                reviewstatsmsg.edit(content);
            }
            let color;
            if (order.review.rating > 2.5) {
                color = 'GREEN'
            } else if (order.review.rating < 2.5) {
                color = 'RED'
            } else if (order.review.rating == 2.5) {
                color = 'GREY'
            }
            const reviewembed = new RichEmbed()
            .setDescription(`**${order.requestor.tag}** has reviewed Discord Eats!`)
            .addField('Star Rating', `${order.review.rating}/5`)
            .addField('Comments', order.review.comments)
            .setThumbnail(msg.author.avatarURL)
            .setColor(color);
            reviewchannel.send(reviewembed);
            if (member) member.user.send(`:white_check_mark: Your review has been accepted! **Reason**: ${reason}`).catch();
            msg.channel.send(`:white_check_mark: Successfully accepted review from order with ID **${order.id}** with reason **${reason}**`);
        } else if (args[0] == 'deny') {
            if (!args[1]) return msg.channel.send(':x: You must include an ID to deny!');
            const order = await client.db.table('orders').get(args[1]).run();
            if (!order) return msg.channel.send(':x: Invalid ID!');
            const member = (await msg.guild.fetchMembers()).members.get(order.requestor.id);
            let reason = 'None';
            if (args[2]) reason = args.slice(2).join(' ');
            const approvalchannel = client.channels.get(client.config.reviewqueue);
            const approvalmsg = await approvalchannel.fetchMessage(order.review.msgid);
            const embed = new RichEmbed()
            .setDescription(`**${order.requestor.tag}** has reviewed Discord Eats and their review has been denied!`)
            .addField('Star Rating', `${order.review.rating}/5`)
            .addField('Comments', order.review.comments)
            .setThumbnail(msg.author.avatarURL)
            .setColor('RED')
            .setFooter(`Denied by ${msg.author.tag} | Reason: ${reason}`);
            approvalmsg.edit(embed);
            if (member) member.user.send(`:x: Your review has been denied! **Reason**: ${reason}`).catch();
            await client.db.table('orders').get(order.id).update({ review: { status: 'DENIED', reason: reason } }).run();
            msg.channel.send(`:white_check_mark: Successfully denied review from order with ID **${order.id}** with reason **${reason}**`);
        } else return msg.channel.send(`:x: Invalid args! Usage: \`${this.meta.usage}\``);
    },
    meta: {
        aliases: ['reviews'],
        permlvl: 2,
        usage: '!reviews <accept/deny> <id> [<reason>]'
    }
}