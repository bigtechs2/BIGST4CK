module.exports = {
    name: "botchannel",
    aliases: ["channel", "group"],
    category: "information",

    code: async (ctx) => {
        // ─── Get the channel link from config ───
        const link = config.bot?.groupLink || config.bot?.channelLink;

        if (!link) {
            return await ctx.reply("❌ No channel link set in config.");
        }

        // ─── Send only the link ───
        await ctx.reply(link);
    }
};