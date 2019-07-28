const { Message } = require('discord.js');
const misc = {};

/**
 * @param {Message} msg
 * @returns {Number} the permlvl
 */
misc.elevation = msg => {
    let permlvl;
    let modrole = msg.guild.roles.find(r => r.name === 'Moderator');
    if (modrole && msg.member.roles.has(modrole.id)) permlvl = 1;
    let adminrole = msg.guild.roles.find(r => r.name === 'Administrator');
    if (adminrole && msg.member.roles.has(adminrole.id)) permlvl = 2;
    return permlvl;
}

misc.firstTimeMSG = [
    '**PLEASE READ**',
    'Thank you for trying to place your first order, befor you continue pleae read this message so you can understand our service.',
    '',
    'In the discord we have channels such as #tos, #rules, #information and #assistance. Please read all of those before continuning with your first order, this is for your safety and ours. We are not a scam nor are we looking to be one. If you want to see other people\'s reviews with our service, please check out #rate-out-service. And if you have any further questions, fel free to contact any staff members (Moderator, Employee, or Administrator).',
    '',
    'If you\'ve completed all this and feel safe using our service, please send this bot the following message: "continue", otherwise you can send the bot "cancel" to cancel your order.'
].join('\n');

/**
 * @param {String} category
 * @returns {Number} number it got before inting
 */
misc.intByOneInDB = async category => {
    const cat = await client.db.table('numData').get(category).run();
    if (!cat) return null;
    const num = cat.number;
    const num2insert = num + 1;
    await client.db.table('numData').get(category).update({ number: num2insert }).run();
    return num;
}

module.exports = misc;