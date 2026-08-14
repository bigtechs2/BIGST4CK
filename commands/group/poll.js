module.exports = {
    name: "poll",
    aliases: ["voting", "jajak"],
    category: "group",
    isGroup: true,

    code: async (ctx) => {
        const text = ctx.args.join(" ");

        if (!text || !text.includes("|")) {
            return await ctx.reply(
                `⚠️ *Wrong format!*\n\n` +
                `Usage: \`${ctx.used.prefix}${ctx.used.command} <question>|<option1>|<option2>|...\`\n\n` +
                `*Example:*\n\`${ctx.used.prefix}${ctx.used.command} Best food?|Pizza|Burger|Sushi\``
            );
        }

        const parts = text.split("|").map(v => v.trim()).filter(Boolean);
        const question = parts[0];
        const options = parts.slice(1);

        if (options.length < 2) {
            return await ctx.reply("⚠️ *You need at least 2 poll options!*");
        }
        if (options.length > 12) {
            return await ctx.reply("⚠️ *Maximum 12 poll options allowed!*");
        }

        try {
            await ctx.core.sendMessage(ctx._msg.key.remoteJid, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: 1,
                    toAnnouncementGroup: false
                }
            }, { quoted: ctx._msg });

        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};