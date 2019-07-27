module.exports = async (msg) => {
    if (msg.author.bot) return;

    if (msg.content.toLowerCase().trim().startsWith(client.config.prefix)) {
        await require('../modules/commandModule.js')(msg);
    }
}