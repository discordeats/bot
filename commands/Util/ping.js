module.exports = {
    run: async (msg, args) => {
        msg.channel.send('Pong!');
    },
    meta: {
        aliases: ['ping'],
        permlvl: 0
    }
}