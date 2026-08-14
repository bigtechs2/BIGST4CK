module.exports = [{
    name: "warning",
    aliases: ["warn"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
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

        if (ctx.helper.areJidsSameUser(target.jid, ctx.me.lid)) return await ctx.reply(ctx.format.info("Cannot change the bot's warnings!"));
        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(ctx.format.info("Cannot give a warning to the group owner!"));

        try {
            const groupDb = ctx.db.group;
            const warnings = groupDb?.warnings || [];
            const maxWarnings = groupDb?.maxwarnings || 3;

            const targetIndex = warnings.findIndex(warning => ctx.helper.areJidsSameUser(warning.jid, target.jid));

            let newWarningCount;

            if (targetIndex !== -1) {
                warnings[targetIndex].count += 1;
                newWarningCount = warnings[targetIndex].count;
            } else {
                newWarningCount = 1;
                warnings.push({
                    jid: target.jid,
                    count: newWarningCount
                });
            }

            groupDb.warnings = warnings;
            groupDb.save();

            if (newWarningCount >= maxWarnings) {
                await ctx.reply(ctx.format.info(`User has reached the warning limit (${newWarningCount}/${maxWarnings}).`));
                await ctx.group().kick(target);
                groupDb.warnings = warnings.filter(warning => warning.jid !== target);
            } else {
                await ctx.reply(ctx.format.info(`Successfully added warning, now ${newWarningCount}/${maxWarnings}.`));
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "unwarning",
    aliases: ["unwarn"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
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

        if (ctx.helper.areJidsSameUser(target.jid, ctx.me.lid)) return await ctx.reply(ctx.format.info("Cannot change the bot's warnings!"));
        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(ctx.format.info("Cannot give a warning to the group owner!"));

        try {
            const groupDb = ctx.db.group;
            const warnings = groupDb?.warnings || [];
            const maxWarnings = groupDb?.maxwarnings || 3;

            const targetIndex = warnings.findIndex(warning => ctx.helper.areJidsSameUser(warning.jid, target.jid));

            if (targetIndex === -1) return await ctx.reply(ctx.format.info("User has no warnings."));

            const currentCount = warnings[targetIndex].count || 0;

            if (currentCount <= 0) {
                warnings.splice(targetIndex, 1);
                groupDb.warnings = warnings;
                groupDb.save();
                return await ctx.reply(ctx.format.info("User has no warnings."));
            }

            const newWarningCount = currentCount - 1;

            if (newWarningCount <= 0) {
                warnings.splice(targetIndex, 1);
            } else {
                warnings[targetIndex].count = newWarningCount;
            }

            groupDb.warnings = warnings;
            groupDb.save();

            await ctx.reply(ctx.format.info(`Successfully reduced warnings to ${newWarningCount}/${maxWarnings}.`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];