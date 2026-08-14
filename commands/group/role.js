module.exports = [{
    name: "promote",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const target = await ctx.target(["quoted", "mentioned"]);

        if (!target.jid)
            return await ctx.reply({
                text: `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.format.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    ctx.format.generateNotes([
                        "Reply/quote a message to make the sender the target."
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(ctx.format.info("That user is a group owner!"));

        try {
            await ctx.group().promote(target.jid);

            await ctx.reply(ctx.format.info("Successfully promoted from member to admin!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "demote",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const target = await ctx.target(["quoted", "mentioned"]);

        if (!target.jid)
            return await ctx.reply({
                text: `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.format.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    ctx.format.generateNotes([
                        "Reply/quote a message to make the sender the target."
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (!await ctx.group().isAdmin(target.jid)) return await ctx.reply(ctx.format.info("That user is a member!"));

        try {
            await ctx.group().demote(target.jid);

            await ctx.reply(ctx.format.info("Successfully demoted from admin to member!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];