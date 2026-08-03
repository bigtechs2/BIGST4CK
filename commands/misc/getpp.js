module.exports = {
    name: "getpp",
    aliases: ["geticon"],
    category: "misc",
    code: async (ctx) => {
        const target = await ctx.target();

        if (!target.jid) {
            const usageText =
                `*Instruction:* Send a text with your command.\n` +
                `*Example:* ${ctx.used} @255719467946\n` +
                `• Reply/quote a message to set the sender as the target account.`;
            return await ctx.reply({
                text: usageText,
                mentions: ["255719362969@s.whatsapp.net"]
            });
        }

        try {
            const result = await ctx.core.profilePictureUrl(target.jid, "image");

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `› ${formatter.bold("Account")}: @${ctx.getId(target.jid)}`,
                mentions: [target.jid]
            });
        } catch (error) {
            await ctx.reply(tools.msg.info("Could not fetch this account's profile picture (they may not have one, or their privacy settings block it)."));
        }
    }
};