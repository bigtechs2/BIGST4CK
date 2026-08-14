module.exports = {
    name: "afk",
    category: "profile",
    code: async (ctx) => {
        const input = ctx.text;

        try {
            const senderDb = ctx.db.user;
            senderDb.afk = {
                reason: input,
                timestamp: Date.now()
            };
            senderDb.save();

            await ctx.reply(ctx.format.info(`You will be AFK, ${input ? `with reason ${ctx.format.inlineCode(input)}` : "without any reason"}`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};