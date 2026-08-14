module.exports = [{
    name: "mute",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (ctx.args[0]?.toLowerCase() === "bot") {
            const groupDb = ctx.db.group;
            groupDb.mutebot = true;
            await groupDb.save();
            return await ctx.reply(ctx.format.info("Successfully muted this group from the bot!"));
        }

        const target = await ctx.target(["quoted", "mentioned"]);
        const daysAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target.jid)
            return await ctx.reply({
                text: `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.format.generateCmdExample(ctx.used, "@6281234567891 8")}\n` +
                    ctx.format.generateNotes([
                        "Reply/quote a message to make the sender the target.",
                        `Type ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} to mute the bot.`
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (daysAmount && daysAmount <= 0) return await ctx.reply(ctx.format.info("Mute duration (in days) must be greater than 0!"));
        if (ctx.helper.areJidsSameUser(target.jid, ctx.me.lid)) return await ctx.reply(ctx.format.info(`Type ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} to mute the bot.`));
        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(ctx.format.info("That user is a group owner!"));

        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];

            const existingMute = muteList.find(m => m.jid === target.jid);
            if (existingMute) return await ctx.reply(ctx.format.info("User is already muted!"));

            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                muteList.push({
                    jid: target.jid,
                    expiration: expirationDate
                });

                groupDb.mute = muteList;
                await groupDb.save();

                await ctx.reply(ctx.format.info(`Successfully muted that user for ${daysAmount} days!`));
            } else {
                muteList.push({
                    jid: target.jid,
                    expiration: null
                });

                groupDb.mute = muteList;
                await groupDb.save();

                await ctx.reply(ctx.format.info("Successfully muted that user!"));
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "unmute",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (ctx.args[0]?.toLowerCase() === "bot") {
            const groupDb = ctx.db.group;
            groupDb.mutebot = false;
            await groupDb.save();
            return await ctx.reply(ctx.format.info("Successfully unmuted this group from the bot!"));
        }

        const target = await ctx.target(["quoted", "mentioned"]);

        if (!target.jid)
            return await ctx.reply({
                text: `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.format.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    ctx.format.generateNotes([
                        "Reply/quote a message to make the sender the target.",
                        `Type ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} to unmute the bot.`
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (ctx.helper.areJidsSameUser(target.jid, ctx.me.lid)) return await ctx.reply(ctx.format.info(`Type ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} to unmute the bot.`));
        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(ctx.format.info("That user is a group owner!"));

        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];

            const index = muteList.findIndex(m => m.jid === target.jid);
            if (index === -1) return await ctx.reply(ctx.format.info("User not found in the mute list!"));

            muteList.splice(index, 1);
            groupDb.mute = muteList;
            await groupDb.save();

            await ctx.reply(ctx.format.info("Successfully unmuted that user from this group!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];