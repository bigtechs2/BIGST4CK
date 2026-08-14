// commands/label.js
module.exports = {
    name: "label",
    aliases: ["tag"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                ctx.format.generateCmdExample(ctx.used, "bot manj")
            );

        if (input.length > 30) return await ctx.reply(ctx.format.info("Maximum 30 characters!"));

        try {
            const waitMsg = await ctx.reply(ctx.format.info(config.msg.wait));
            const groupJids = Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id);
            const {
                delay
            } = ctx.helper.calculateDelay(groupJids.length);
            for (const groupJid of groupJids) {
                try {
                    await ctx.core.updateMemberLabel(groupJid, input);
                    await ctx.helper.delay(delay);
                } catch {}
            }

            await ctx.editMessage(ctx.id, waitMsg.key, ctx.format.info(`Bot label successfully changed to ${ctx.format.inlineCode(input)} in ${groupJids.length} groups!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error, false);
        }
    }
};