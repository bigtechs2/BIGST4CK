module.exports = {
    name: "intro",
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const introText = ctx.db.group.text?.intro;

            await ctx.reply(introText || ctx.format.info("This group has no intro."));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};