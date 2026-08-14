module.exports = {
    name: "setbotcover",
    aliases: ["setcoverbot"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        if (!ctx.isMedia(["image"])) return await ctx.reply(ctx.format.generateInstruction(["send", "reply"], ["image"]));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            await ctx.core.updateCoverPhoto(buffer);

            await ctx.reply(ctx.format.info("Successfully changed the bot cover image!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};