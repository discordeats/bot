module.exports = async (messageReaction, user) => {
    const msg = messageReaction.message;
    const emoji = messageReaction.emoji;
    if (msg.id == client.config.tosmsg) {
        if (emoji.name == '✅') {
            const verified = msg.guild.roles.find(r => r.name === 'Verified');
            const member = (await msg.guild.fetchMembers()).members.get(user.id);
            member.addRole(verified); 
        } 
    }
}