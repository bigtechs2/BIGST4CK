const util = require("node:util");

module.exports = (bot) => {
    bot.ev.once("ClientReady", async (b) => {
        console.log(util.styleText("blue", "[>]"), `${config.bot.name} by ${config.owner.name}, ready at ${b.user?.id || b.user?.lid}`);

        const botDb = bot.getDb("bot");
        const botRestart = botDb?.restart || {};
        if (botRestart?.jid && botRestart?.timestamp && botRestart?.readyAt) {
            bot.readyAt = botRestart.readyAt;
            const timeago = bot.format.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.sendMessage(botRestart.jid, {
                text: bot.format.info(`Successfully restarted! Took ${timeago}.`),
                edit: botRestart.key
            });
            botDb.restart = {};
            botDb.save();
        }

        const groupLink = `https://chat.whatsapp.com/${config.bot?.groupJid ? await b.groupInviteCode(config.bot.groupJid).catch(() => "FxEYZl2UyzAEI2yhaH34Ye") : "FxEYZl2UyzAEI2yhaH34Ye"}`;

        // ── The line below used `config.core.set(...)` but `config.core` is undefined
        // because we now load config.json manually with fs.
        // To avoid the crash, we comment it out.
        // If you need to auto‑update the group link, you can write it to the database
        // or directly to config.json using fs.
        //
        // if (!config.bot.groupLink || config.bot.groupLink !== groupLink) {
        //     console.log(`[ready] Group link updated to ${groupLink}`);
        //     config.bot.groupLink = groupLink;
        //     // Optionally write to config.json here
        // }
        console.log(`[ready] Group link: ${groupLink}`);
    });
};