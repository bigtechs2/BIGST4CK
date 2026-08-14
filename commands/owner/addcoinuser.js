// commands/addcoinuser.js
module.exports = {
    name: "addcoinuser",
    aliases: ["acu", "addcoin"],
    category: "owner",
    permissions: {
        owner: true
    },

    code: async (ctx) => {
        const target = await ctx.target();
        const coinAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target || !coinAmount)
            return await ctx.reply({
                text: `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.format.generateCmdExample(ctx.used, "@6281234567891 8 -s")}\n` +
                    `${ctx.format.generateNotes([
                        "Reply/quote a message to make the sender the target."
                    ])}\n` +
                    ctx.format.generatesFlagInfo({
                        "-s": "Stay silent – do not broadcast to the target"
                    }),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        try {
            const targetDb = ctx.getDb("users", target.jid);
            targetDb.coin += coinAmount;
            targetDb.save();

            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;

            if (!silent && !config.system.restrict) {
                await ctx.sendMessage(
                    target.jid,
                    ctx.format.info(`You have received ${coinAmount} coins from the owner!`)
                );
            }

            await ctx.reply(ctx.format.info(`Successfully added ${coinAmount} coins to that user!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};