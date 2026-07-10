// Import required modules and dependencies
const { Baileys, Cooldown } = require("@itsreimau/gktw");
const moment = require("moment-timezone");

// Main bot middleware
module.exports = (bot) => {
    bot.use(async (ctx, next) => {
        // Common variables
        const isGroup = ctx.isGroup();
        const isPrivate = ctx.isPrivate();
        const senderJid = ctx.sender.jid;
        const senderId = ctx.getId(senderJid);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? ctx.getId(groupJid) : null;
        const isOwner = ctx.sender.isOwner();
        const isAdmin = isGroup ? await ctx.group().isSenderAdmin() : false;

        // Get databases
        const botDb = ctx.db.bot;
        const senderDb = ctx.db.user;
        const groupDb = ctx.db.group;

        // Check bot mode (group, private, self)
        if (botDb?.mode === "premium" && !isOwner && !senderDb?.premium) return;
        if (botDb?.mode === "group" && isPrivate && !isOwner && !senderDb?.premium) return;
        if (botDb?.mode === "private" && isGroup && !isOwner && !senderDb?.premium) return;
        if (botDb?.mode === "self" && !isOwner) return;

        // Check mute in group
        if (groupDb?.mutebot && !isOwner && !isAdmin && (!ctx.used.command === "unmute" && ctx.args[0]?.toLowerCase() === "bot")) return;
        const muteList = groupDb?.mute || [];
        if (muteList.some(mute => mute.jid === ctx.sender.lid)) return;

        // Log incoming command
        if (isGroup && !ctx.msg.key.fromMe) {
            log.cmd(
                `${ctx.used.command} | ${groupId} | ${senderId}`
            );
        } else if (isPrivate && !ctx.msg.key.fromMe) {
            log.cmd(
                `${ctx.used.command} | ${senderId}`
            );
        }

        // Add XP and handle level-up
        const xpGain = 10;
        const xpToLevelUp = 100;
        let newSenderXp = (senderDb?.xp || 0) + xpGain;
        if (newSenderXp >= xpToLevelUp) {
            const senderLevel = senderDb?.level || 0;
            let newSenderLevel = senderLevel + 1;
            newSenderXp -= xpToLevelUp;
            if (senderDb?.autolevelup) {
                const profilePictureUrl = await ctx.profilePictureUrl(senderJid);
                const canvasUrl = tools.api.createUrl("siputzx", "/api/canvas/level-up", {
                    backgroundURL: "https://picsum.photos/600/150",
                    avatarURL: profilePictureUrl,
                    fromLevel: senderLevel,
                    toLevel: newSenderLevel,
                    name: ctx.sender.pushName
                });
                await ctx.reply({
                    image: {
                        url: canvasUrl
                    },
                    caption: tools.msg.info(`Congratulations! You have moved up to a level ${newSenderLevel}.`),
                    buttons: [{
                        text: "Disable Autolevelup",
                        id: `${ctx.used.prefix}setprofile autolevelup`
                    }]
                });
            }
            senderDb.xp = newSenderXp;
            senderDb.level = newSenderLevel;
            senderDb.save();
        } else {
            senderDb.xp = newSenderXp;
            senderDb.save();
        }

        // Simulate typing
        const simulateTyping = async () => {
            if (config.system.autoTypingOnCmd) await ctx.simulateTyping();
        };

        // Check restrictions
        const restrictions = [{
            key: "banned",
            condition: senderDb?.banned && ctx.used.command !== "owner",
            msg: config.msg.banned,
            buttons: [{
                text: "Contact Owner",
                id: `${ctx.used.prefix}owner`
            }],
            reaction: "🚫"
        }, {
            key: "cooldown",
            condition: new Cooldown(ctx, config.system.cooldown, "multi").onCooldown && !isOwner && !senderDb?.premium,
            msg: config.msg.cooldown,
            reaction: "💤"
        }, {
            key: "gamerestrict",
            condition: groupDb?.option?.gamerestrict && isGroup && !isOwner && !isAdmin && ctx.bot.cmd.get(ctx.used.command).category === "game",
            msg: config.msg.gamerestrict,
            reaction: "🎮"
        }, {
            key: "privatePremiumOnly",
            condition: config.system.privatePremiumOnly && !isOwner && !senderDb?.premium && !["price", "owner"].includes(ctx.used.command),
            msg: config.msg.privatePremiumOnly,
            buttons: [{
                text: "Premium Price",
                id: `${ctx.used.prefix}price`
            }, {
                text: "Contact Owner",
                id: `${ctx.used.prefix}owner`
            }],
            reaction: "💎"
        }, {
            key: "requireBotGroupMembership",
            condition: await (async () => {
                if (!config.system.requireBotGroupMembership || isOwner || senderDb?.premium || ctx.used.command === "botgroup" || !config.bot.groupJid) return false;
                const now = Date.now();
                const duration = 24 * 60 * 60 * 1000;
                if (senderDb?.botGroupMembership?.isMember && now - senderDb?.botGroupMembership?.timestamp < duration) return senderDb.botGroupMembership.isMember;
                const isMember = await ctx.group(config.bot.groupJid).isMemberExist(ctx.sender.lid);
                senderDb.botGroupMembership = {
                    isMember: isMember,
                    timestamp: now
                };
                senderDb.save();
                return isMember;
            })(),
            msg: config.msg.botGroupMembership,
            buttons: [{
                text: "Bot Group",
                id: `${ctx.used.prefix}botgroup`
            }],
            reaction: "🚫"
        }, {
            key: "requireGroupSewa",
            condition: config.system.requireGroupSewa && isGroup && !isOwner && !["price", "owner"].includes(ctx.used.command) && groupDb?.sewa !== true,
            msg: config.msg.groupSewa,
            buttons: [{
                text: "Rental price",
                id: `${ctx.used.prefix}price`
            }, {
                text: "Contact Owner",
                id: `${ctx.used.prefix}owner`
            }],
            reaction: "🔒"
        }, {
            key: "unavailableAtNight",
            condition: (() => {
                if (!config.system.unavailableAtNight || isOwner || senderDb?.premium) return false;
                const now = moment().tz(config.system.timeZone);
                const hour = now.hour();
                return hour >= 0 && hour < 6;
            })(),
            msg: config.msg.unavailableAtNight,
            reaction: "😴"
        }];

        for (const {
                condition,
                msg,
                reaction,
                key,
                buttons
            }
            of restrictions) {
            if (condition) {
                const now = Date.now();
                const lastSentMsg = senderDb?.lastSentMsg?.[key] || 0;
                const oneDay = 24 * 60 * 60 * 1000;
                if (!lastSentMsg || (now - lastSentMsg) > oneDay) {
                    await simulateTyping();
                    (senderDb.lastSentMsg ||= {})[key] = now;
                    senderDb.save();
                    return await ctx.reply({
                        text: tools.msg.info(`${msg} The next response will be an emoji reaction. ${formatter.inlineCode(reaction)}.`),
                        buttons: buttons || null
                    });
                } else {
                    return await ctx.replyReact(reaction);
                }
            }
        }

        // Check command permissions
        const command = [...ctx.bot.cmd.values()].find(cmd => [cmd.name, ...(cmd?.aliases || [])].includes(ctx.used.command));
        if (!command) return await next();
        const {
            permissions = {}
        } = command;
        const permissionChecks = [{
            key: "admin",
            condition: isGroup && !isAdmin && !isOwner,
            msg: config.msg.admin,
            reaction: "🛡️"
        }, {
            key: "botAdmin",
            condition: isGroup && !await ctx.group(groupJid, !config.system.selfReply).isBotAdmin(),
            msg: config.msg.botAdmin,
            reaction: "🤖"
        }, {
            key: "coin",
            condition: (() => {
                if (!config.system.useCoin || isOwner || senderDb?.premium) return false;
                if (senderDb?.coin >= permissions.coin) {
                    senderDb.coin -= permissions.coin;
                    senderDb.save();
                    return false;
                }
                return true;
            })(),
            msg: config.msg.coin,
            buttons: [{
                text: "Coin Check",
                id: `${ctx.used.prefix}coin`
            }],
            reaction: "💰"
        }, {
            key: "group",
            condition: isPrivate,
            msg: config.msg.group,
            reaction: "👥"
        }, {
            key: "owner",
            condition: !isOwner,
            msg: config.msg.owner,
            reaction: "👑"
        }, {
            key: "premium",
            condition: !senderDb?.premium && !isOwner,
            msg: config.msg.premium,
            buttons: [{
                text: "Premium Price",
                id: `${ctx.used.prefix}price`
            }, {
                text: "Contact Owner",
                id: `${ctx.used.prefix}owner`
            }],
            reaction: "💎"
        }, {
            key: "private",
            condition: isGroup,
            msg: config.msg.private,
            reaction: "📩"
        }, {
            key: "restrict",
            condition: config.system.restrict,
            msg: config.msg.restrict,
            reaction: "🚫"
        }];

        for (const {
                key,
                condition,
                msg,
                reaction,
                buttons
            }
            of permissionChecks) {
            if (permissions[key] && condition) {
                const now = Date.now();
                const lastSentMsg = senderDb?.lastSentMsg?.[key] || 0;
                const oneDay = 24 * 60 * 60 * 1000;
                if (!lastSentMsg || (now - lastSentMsg) > oneDay) {
                    await simulateTyping();
                    (senderDb.lastSentMsg ||= {})[key] = now;
                    senderDb.save();
                    return await ctx.reply({
                        text: tools.msg.info(`${msg} The next response will be an emoji reaction. ${formatter.inlineCode(reaction)}.`),
                        buttons: buttons || null
                    });
                } else {
                    return await ctx.replyReact(reaction);
                }
            }
        }

        await simulateTyping();
        await next(); // Proceed to the next process
    });
};