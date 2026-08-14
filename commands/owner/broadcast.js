module.exports = [{
    name: "broadcastgc",
    aliases: ["bc", "bcht", "bcgc", "broadcast"],
    category: "owner",
    permissions: {
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "hello, world!")}\n` +
                ctx.format.generateNotes([
                    `Use ${ctx.format.inlineCode("blacklist")} to add a group to the blacklist. (Only works in groups)`
                ])
            );

        const botDb = ctx.db.bot;
        let blacklist = botDb?.blacklistBroadcast || [];

        if (ctx.args[0]?.toLowerCase() === "blacklist" && ctx.isGroup()) {
            const groupIndex = blacklist.indexOf(ctx.id);
            if (groupIndex > -1) {
                blacklist.splice(groupIndex, 1);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(ctx.format.info("This group has been removed from the broadcast blacklist."));
            } else {
                blacklist.push(ctx.id);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(ctx.format.info("This group has been added to the broadcast blacklist."));
            }
        }

        try {
            const groupJids = Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !blacklist.includes(group.id) && !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id);
            const {
                delay,
                duration
            } = ctx.helper.calculateDelay(groupJids.length);
            const waitMsg = await ctx.reply(ctx.format.info(`Sending broadcast to ${groupJids.length} groups, estimated time: ${ctx.format.convertMsToDuration(duration)}`));
            for (const groupJid of groupJids) {
                try {
                    await ctx.sendMessage(groupJid, {
                        image: {
                            url: config.bot.thumbnail
                        },
                        caption: input,
                        mentionAll: ctx.used.command === "bcht" ? true : false,
                        footer: config.msg.footer,
                        buttons: [{
                            text: "Contact Owner",
                            id: `${ctx.used.prefix}owner`
                        }, {
                            text: "Donate",
                            id: `${ctx.used.prefix}donate`
                        }]
                    });
                    await ctx.helper.delay(delay);
                } catch {}
            }

            await ctx.editMessage(ctx.id, waitMsg.key, ctx.format.info(`Successfully sent to ${groupJids.length} groups.`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "broadcastgcsw",
    aliases: ["bcgcsw", "bcswgc"],
    category: "owner",
    permissions: {
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "hello, world!")}\n` +
                ctx.format.generateNotes([
                    `Use ${ctx.format.inlineCode("blacklist")} to add a group to the blacklist. (Only works in groups)`
                ])
            );

        const botDb = ctx.db.bot;
        let blacklist = botDb?.blacklistBroadcast || [];

        if (ctx.args[0]?.toLowerCase() === "blacklist" && ctx.isGroup()) {
            const groupIndex = blacklist.indexOf(ctx.id);
            if (groupIndex > -1) {
                blacklist.splice(groupIndex, 1);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(ctx.format.info("This group has been removed from the broadcast blacklist."));
            } else {
                blacklist.push(ctx.id);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(ctx.format.info("This group has been added to the broadcast blacklist."));
            }
        }

        try {
            const groupJids = Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !blacklist.includes(group.id) && !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id);
            let content;
            const type = ctx.isMedia(["image", "video"]);
            if (["image", "video"].includes(type)) {
                const buffer = await ctx.msg.download() || await ctx.quoted.download();
                content = {
                    [type]: buffer,
                    caption: input
                };
            } else {
                content = {
                    text: input
                };
            }
            const {
                delay,
                duration
            } = ctx.helper.calculateDelay(groupJids.length);
            const waitMsg = await ctx.reply(ctx.format.info(`Sending broadcast to ${groupJids.length} groups, estimated time: ${ctx.format.convertMsToDuration(duration)}`));
            for (const groupJid of groupJids) {
                try {
                    await ctx.sendMessage(groupJid, {
                        ...content,
                        groupStatus: true
                    });
                    await ctx.helper.delay(delay);
                } catch {}
            }

            await ctx.editMessage(ctx.id, waitMsg.key, ctx.format.info(`Successfully sent to ${groupJids.length} groups.`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];