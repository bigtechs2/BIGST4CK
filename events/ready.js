// Import required modules and dependencies
const { Events } = require("@itsreimau/gktw");

module.exports = (bot) => {
    // Event when bot is ready
    bot.ev.once(Events.ClientReady, async (b) => {
        console.log(`${config.bot.name} by ${config.owner.name}, ready at ${b.user?.id || b.user?.lid}`);

        // Bot restart handling
        const botDb = bot.getDb("bot");
        const botRestart = botDb?.restart || {};
        if (botRestart?.jid && botRestart?.timestamp && botRestart?.readyAt) {
            bot.readyAt = botRestart.readyAt;
            const timeago = tools.msg.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.sendMessage(botRestart.jid, {
                text: tools.msg.info(`Restarted successfully! It took ${timeago}.`),
                edit: botRestart.key
            });
            delete botDb.restart;
            botDb.save();
        }

        // Set bot config
        const groupLink = `https://chat.whatsapp.com/${config.bot?.groupJid ? await b.groupInviteCode(config.bot.groupJid).catch(() => "FxEYZl2UyzAEI2yhaH34Ye") : "FxEYZl2UyzAEI2yhaH34Ye"}`;
        if (!config.bot.groupLink || config.bot.groupLink !== groupLink) config.core.set("bot.groupLink", groupLink);
    });
};