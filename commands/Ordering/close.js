module.exports = {
    run: async (msg, args) => {
        if (!msg.channel.name.includes('order')) return msg.channel.send(':x: This command is only meant to be run in an order channel!');
        msg.channel.send(':white_check_mark: Order canceled! Deleting the channel in 10 seconds...');
        setTimeout(() => {
            msg.channel.delete();
        }, 10000);
    },
    meta: {
        permlvl: 0,
        aliases: ['close']
    }
}