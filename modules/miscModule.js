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

module.exports = misc;