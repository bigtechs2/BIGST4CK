module.exports = {
    name: "coin",
    aliases: ["koin"],
    category: "profile",
    code: async (ctx) => {
        if (ctx.sender.isOwner() || ctx.db.user?.premium) return await ctx.reply(ctx.format.info("› You have unlimited coins."));

        try {
            const coin = ctx.db.user.coin || 0;

            await ctx.reply(ctx.format.info(`› You have ${coin} remaining coins.`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};