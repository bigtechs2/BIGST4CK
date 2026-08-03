module.exports = (bot) => {
    bot.ev.on("BotJoin", async (join) => {
        const botDb = bot.getDb("bot");
        const lastPrefix = botDb?.lastPrefix || "/";
        await bot.sendMessage(join.id, {
            caption: `>ᴗ< ${bot.format.italic(`Hello! I am a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. I can perform many commands, such as creating stickers, using AI for certain tasks, and various other useful commands. I'm here to entertain and keep you company!`)}`,
            location: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: config.bot.name,
                address: "Don't forget to donate to keep the bot online.",
                jpegThumbnail: await bot.helper.getJpegThumbnail(config.bot.thumbnail)
            },
            buttons: [{
                text: "Menu",
                id: `${lastPrefix}menu`
            }, {
                text: "Contact Owner",
                id: `${lastPrefix}owner`
            }, {
                text: "Donate",
                id: `${lastPrefix}donate`
            }]
        });
    });
};