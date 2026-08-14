module.exports = [{
    name: "addpremiumuser",
    aliases: ["addpremuser", "addprem", "apu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();
        const daysAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target.jid)
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

        if (daysAmount && daysAmount <= 0) return await ctx.reply(ctx.format.info("Premium duration (in days) must be provided and greater than 0!"));

        try {
            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;

            const targetDb = ctx.getDb("users", target.jid);
            targetDb.premium = true;
            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                targetDb.premiumExpiration = expirationDate;
                targetDb.save();

                if (!silent && !config.system.restrict) {
                    await ctx.sendMessage(target.jid, ctx.format.info(`You have been added as a premium user by the owner for ${daysAmount} days!`));
                }

                await ctx.reply(ctx.format.info(`Successfully added premium for ${daysAmount} days to that user!`));
            } else {
                targetDb.premiumExpiration = null;
                targetDb.save();

                if (!silent && !config.system.restrict) {
                    await ctx.sendMessage(target.jid, ctx.format.info("You have been added as a permanent premium user by the owner!"));
                }

                await ctx.reply(ctx.format.info("Successfully added permanent premium to that user!"));
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "delpremiumuser",
    aliases: ["delpremuser", "delprem", "dpu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();

        if (!target.jid)
            return await ctx.reply({
                text: `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.format.generateCmdExample(ctx.used, "@6281234567891 -s")}\n` +
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
            targetDb.premium = false;
            targetDb.premiumExpiration = null;
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
                await ctx.sendMessage(target.jid, ctx.format.info("You have been removed as a premium user by the owner!"));
            }

            await ctx.reply(ctx.format.info("Successfully removed premium from that user!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];