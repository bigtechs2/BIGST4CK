// Import required modules and dependencies
const { Baileys, Events, Gktw } = require("@itsreimau/gktw");
const moment = require("moment-timezone");
const { handleAutoDownloader } = require("../tools/neko");

// Function to add warning
async function handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb) {
    const maxWarnings = groupDb?.maxwarnings || 3;
    const warnings    = groupDb?.warnings || [];

    // Punishment mode: autokick = kick after maxWarnings, warnonly = warning only
    const isAutokick  = groupDb?.option?.autokick || false;

    const senderWarning = warnings.find(warning => tools.cmd.areJidsSameUser(warning.jid, senderLid));
    let currentWarnings = senderWarning ? senderWarning.count : 0;
    currentWarnings    += 1;

    if (senderWarning) {
        senderWarning.count = currentWarnings;
    } else {
        warnings.push({ jid: senderLid, count: currentWarnings });
    }

    groupDb.warnings = warnings;

    const warnSuffix = isAutokick
        ? ` — auto kick when warning reaches ${maxWarnings}.`
        : ` — just a warning, no kick.`;

    await ctx.reply({
        text: tools.msg.info(
            `Warning ${currentWarnings}/${maxWarnings} For @${ctx.getId(senderId)}!${warnSuffix}`
        ),
        mentions: [senderJid]
    });

    if (isAutokick && currentWarnings >= maxWarnings) {
        const isBotAdmin = await ctx.group(groupJid, !config.system.selfReply).isBotAdmin();
        if (isBotAdmin) {
            await ctx.reply({
                text: tools.msg.info(
                    `@${ctx.getId(senderId)} has received ${maxWarnings} warnings and has been removed from the group.`
                ),
                mentions: [senderJid]
            });
            if (!config.system.restrict) await ctx.group().kick(senderJid);
            groupDb.warnings = warnings.filter(warning => warning.jid !== senderLid);
        } else {
            await ctx.reply({
                text: tools.msg.info(
                    `${config.msg.botAdmin} Unable to eject @${ctx.getId(senderId)} who has reached ${maxWarnings} warnings.`
                ),
                mentions: [senderJid]
            });
        }
    }

    groupDb.save();
}

module.exports = (bot) => {

    if (!global.groupScheduler) {

        console.log("[GroupScheduler] Started");

        global.groupScheduler = setInterval(async () => {

            try {

                const groups =
                    bot.db.collections
                        .find(v => v.name === "groups")
                        ?.getAll() || [];

                const now = moment()
                    .tz(config.system.timeZone);

                const current =
                    String(now.hour()).padStart(2, "0") +
                    ":" +
                    String(now.minute()).padStart(2, "0");

                for (const group of groups) {

                    try {

                        if (
                            group.autoClose &&
                            group.autoClose === current
                        ) {

                            console.log(
                                "[AUTO CLOSE]",
                                group.jid
                            );

                            await bot.core.groupSettingUpdate(
                                group.jid,
                                "announcement"
                            );

                            await bot.sendMessage(
                                group.jid,
                                {
                                    text: "🔒 The group will be closed automatically as scheduled."
                                }
                            );

                        }

                        if (
                            group.autoOpen &&
                            group.autoOpen === current
                        ) {

                            console.log(
                                "[AUTO OPEN]",
                                group.jid
                            );

                            await bot.core.groupSettingUpdate(
                                group.jid,
                                "not_announcement"
                            );

                            await bot.sendMessage(
                                group.jid,
                                {
                                    text: "🔓 Groups open automatically according to schedule."
                                }
                            );

                        }

                        // ========== FIXED AutoUnlockSpam (no more 403) ==========
                        if (
                            group.spamLockUntil &&
                            Date.now() >= group.spamLockUntil
                        ) {
                            try {
                                // Check if bot is admin before trying to open
                                const meta = await bot.core.groupMetadata(group.jid).catch(() => null);
                                const isBotAdmin = meta ? meta.participants.some(p => p.id === bot.user.id && p.admin) : false;
                                if (isBotAdmin) {
                                    await bot.core.groupSettingUpdate(
                                        group.jid,
                                        "not_announcement"
                                    );
                                    await bot.sendMessage(
                                        group.jid,
                                        {
                                            text: tools.msg.info("The group has been reopened after the spam lock period ended..")
                                        }
                                    );
                                } else {
                                    console.log(`[AutoUnlockSpam] Skipped unlock for ${group.jid} - Bot not admin.`);
                                }
                                delete group.spamLockUntil;
                                group.save();
                            } catch (err) {
                                console.error("[AutoUnlockSpam]", err);
                            }
                        }

                    } catch (err) {
                        console.error(
                            "[GroupScheduler]",
                            err
                        );
                    }

                }

            } catch (err) {
                console.error(
                    "[GroupScheduler]",
                    err
                );
            }

        }, 30000);

    }

    // Event when bot receives a message
    bot.ev.on(Events.MessagesUpsert, async (ctx) => {
        const {
            msg
        } = ctx;
        if (msg.key.fromMe) return;

        // Common variables
        const isGroup = ctx.isGroup();
        const isPrivate = ctx.isPrivate();

        if (isGroup || isPrivate) {
            // Common variables
            const senderJid = ctx.sender.jid;
            const senderId = ctx.getId(senderJid);
            const senderLid = ctx.sender.lid;
            const groupJid = isGroup ? ctx.id : null;
            const groupId = isGroup ? ctx.getId(groupJid) : null;
            const isOwner = ctx.sender.isOwner();
            const isCmd = ctx.isCmd();
            const isAdmin = isGroup ? await ctx.group().isSenderAdmin() : false;

            // Get databases
            const botDb = ctx.db.bot;
            const senderDb = ctx.db.user;
            const groupDb = ctx.db.group;

            // User database handling
            if (senderDb) {
                // Check premium expiration
                if (senderDb?.premium && Date.now() > senderDb?.premiumExpiration) {
                    delete senderDb.premium;
                    delete senderDb.premiumExpiration;
                }
                // ✅ COINS RE-ENABLED - Reset coins for owner/premium
                if (isOwner || senderDb?.premium) senderDb.coin = 0;
                if (!senderDb?.coin || !Number.isFinite(senderDb?.coin)) senderDb.coin = 100;
                senderDb.save();
            }

            // ✅ MODE CHECKS RE-ENABLED
            if (botDb?.mode === "premium" && !isOwner && !senderDb?.premium) return;
            if (botDb?.mode === "group" && isPrivate && !isOwner && !senderDb?.premium) return;
            if (botDb?.mode === "private" && isGroup && !isOwner && !senderDb?.premium) return;
            if (botDb?.mode === "self" && !isOwner) return;

            // Bug handling
            if (typeof Gktw.analyzeBug === "function") {
                const analyze = Gktw.analyzeBug(msg.message, {
                    maxTextLength: 10000,
                    maxMentions: 1000,
                    maxFileLength: 2 * 1024 * 1024 * 1024,
                    maxPageCount: 10000,
                    maxCharacterFlood: 20000
                });
                if (config.system.antiBug && analyze.isMalicious && !senderDb?.banned && !isOwner) {
                    await ctx.deleteMessage(ctx.id, msg.key);
                    await ctx.block(senderJid);
                    senderDb.banned = true;
                    senderDb.save();

                    const reportOwner = tools.cmd.getReportOwner();
                    if (reportOwner && reportOwner.length > 0) {
                        const {
                            delay
                        } = tools.cmd.calculateDelay(reportOwner.length);
                        for (const ownerId of reportOwner) {
                            await ctx.replyWithJid(ownerId + Baileys.S_WHATSAPP_NET, {
                                text: tools.msg.info(`Account @${senderId} has been automatically banned for reason ${formatter.inlineCode(`Anti Bug - ${analyze.reason}`)}, danger level ${formatter.inlineCode(analyze.severity)}, threat types ${formatter.inlineCode(analyze.severity)}.`),
                                mentions: [senderJid]
                            });
                            await tools.cmd.delay(delay);
                        }
                    }
                }
            } else if (!global.gktwBugWarned) {
                global.gktwBugWarned = true;
                console.warn("[WARNING] Gktw.analyzeBug is not available in this package version — the anti-bug feature is temporarily disabled.");
            }

            // Group mute check
            if (isGroup) {
                if (groupDb?.mutebot) return;

                const muteList = groupDb?.mute || [];

                groupDb.mute = muteList.filter(
                    mute => !mute.expiration || Date.now() <= mute.expiration
                );

                if (groupDb.mute.length !== muteList.length) {
                    await groupDb.save();
                }

                if (groupDb.mute.some(mute => mute.jid === ctx.sender.lid)) {
                    await ctx.deleteMessage(ctx.id, msg.key);
                }
            }

            // ✅ UNAVAILABLE AT NIGHT RE-ENABLED
            const now = moment().tz(config.system.timeZone);
            const hour = now.hour();
            if (config.system.unavailableAtNight && !isOwner && !senderDb?.premium && hour >= 0 && hour < 6) return;

            // Did you mean?
            if (isCmd?.didyoumean)
                await ctx.reply({
                    text: tools.msg.info(`What do you mean? ${formatter.inlineCode(isCmd.prefix + isCmd.didyoumean)}?`),
                    buttons: [{
                        text: "Yes, right!",
                        id: `${isCmd.prefix + isCmd.didyoumean} ${isCmd.input}`
                    }]
                });

            // AFK handling (Remove AFK status of users who send messages)
            const senderAfk = senderDb?.afk || {};
            if (senderAfk.reason || senderAfk.timestamp) {
                const timeElapsed = Date.now() - senderAfk.timestamp;
                if (timeElapsed > 3000) {
                    const timeago = tools.msg.convertMsToDuration(timeElapsed);
                    await ctx.reply(tools.msg.info(`You have left AFK ${senderAfk.reason ? `with reason ${formatter.inlineCode(senderAfk.reason)}` : "without reason"} during ${timeago}.`));
                    delete senderDb.afk;
                    senderDb.save();
                }
            }

            // =========================
            // AUTO DOWNLOADER
            // Runs BEFORE antilink so that links detected by download platforms don't get deleted
            // =========================
            const autoDlActive = isGroup
                ? groupDb?.option?.autodl
                : botDb?.autodl;

            if (!isCmd && autoDlActive) {
                await handleAutoDownloader(ctx);
            }

            // Group chat handling
            if (isGroup) {
                if (!isCmd || isCmd?.didyoumean)
                    log.info(
                        `MSG | ${groupId} | ${senderId}`
                    );

                const messageType = ctx.getMessageType();
                
                // Group database handling
                if (groupDb?.sewa && Date.now() > senderDb?.sewaExpiration) {
                    delete groupDb.sewa;
                    delete groupDb.sewaExpiration;
                    groupDb.save();
                }

                // AFK handling (Users who are mentioned or quoted)
                const afkMentions = ctx.quoted ? [ctx.quoted.sender] : await ctx.getMentioned();
                if (afkMentions.length > 0) {
                    for (const afkMention of afkMentions) {
                        const mentionAfk = ctx.getDb("users", afkMention)?.afk || {};
                        if (mentionAfk.reason || mentionAfk.timestamp) {
                            const timeago = tools.msg.convertMsToDuration(Date.now() - mentionAfk.timestamp);
                            await ctx.reply({
                                text: tools.msg.info(`Don't disturb! @${ctx.getId(afkMention)} currently AFK ${mentionAfk.reason ? `with reason ${formatter.inlineCode(mentionAfk.reason)}` : "without reason"} during ${timeago}.`),
                                mentions: [afkMention]
                            });
                        }
                    }
                }

                if (!isCmd && !isOwner && !isAdmin) {
                    // Anti media handling
                    for (const type of ["audio", "document", "image", "sticker", "video"]) {
                        if (groupDb?.option?.[`anti${type}`]) {
                            const checkMedia = tools.cmd.checkMedia(messageType, type);
                            if (!!checkMedia) {
                                await ctx.reply(tools.msg.info(`Do not send ${type}!`));
                                await ctx.deleteMessage(ctx.id, msg.key);
                                await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                            }
                        }
                    }

                    // Anti GC status
                    if (groupDb?.option?.antigcsw) {
                        const checkMedia = msg.message?.groupStatusMessageV2?.contextInfo?.isGroupStatus;
                        if (checkMedia) {
                            await ctx.reply(tools.msg.info("Don't make SW in the group, no one cares!"));
                            await ctx.deleteMessage(ctx.id, msg.key);
                            await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                        }
                    }

                    // Anti link
                    if (groupDb?.option?.antilink) {
                        if (msg.body && tools.cmd.isUrl(msg.body) && !autoDlActive) {
                            await ctx.reply(tools.msg.info("Don't send links!"));
                            await ctx.deleteMessage(ctx.id, msg.key);
                            await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                        }
                    }

                    // Anti spam
                    if (groupDb?.option?.antispam) {
                        const now = Date.now();
                        const spamData = groupDb?.spam || [];
                        const senderSpam = spamData.find(spam => tools.cmd.areJidsSameUser(spam.jid, senderLid)) || {
                            jid: senderLid,
                            count: 0,
                            lastMessageTime: 0
                        };

                        const timeDiff = now - senderSpam.lastMessageTime;
                        const newCount = timeDiff < 5000 ? senderSpam.count + 1 : 1;

                        senderSpam.count = newCount;
                        senderSpam.lastMessageTime = now;
                        if (!spamData.some(spam => tools.cmd.areJidsSameUser(spam.jid, senderLid))) spamData.push(senderSpam);
                        groupDb.spam = spamData;

                        if (newCount > 9) {
                            await ctx.deleteMessage(ctx.id, msg.key);
                            groupDb.spam = spamData.filter(spam => spam.jid !== senderLid);

                            const isAutokickSpam = groupDb?.option?.autokick || false;
                            const isBotAdminSpam = await ctx.group(groupJid, !config.system.selfReply).isBotAdmin();

                            senderDb.banned = true;
                            senderDb.save();

                            if (!isAutokickSpam) {
                                await ctx.reply({
                                    text: tools.msg.info(
                                        `@${ctx.getId(senderId)} Spam detected! The group is temporarily closed for 3 minutes and the user has been banned from the bot.`
                                    ),
                                    mentions: [senderJid]
                                });

                                if (isBotAdminSpam && !config.system.restrict) {
                                    await ctx.core.groupSettingUpdate(groupJid, "announcement");
                                    groupDb.spamLockUntil = Date.now() + (3 * 60 * 1000);
                                    groupDb.save();
                                } else if (!isBotAdminSpam) {
                                    await ctx.reply(tools.msg.info(`${config.msg.botAdmin} Can't close group because bot is not admin.`));
                                }
                            } else {
                                if (isBotAdminSpam) {
                                    await ctx.reply({
                                        text: tools.msg.info(
                                            `@${ctx.getId(senderId)} Spam detected! User has been removed from the group and banned from the bot.`
                                        ),
                                        mentions: [senderJid]
                                    });
                                    if (!config.system.restrict) await ctx.group().kick(senderJid);
                                } else {
                                    await ctx.reply({
                                        text: tools.msg.info(
                                            `${config.msg.botAdmin} Unable to eject @${ctx.getId(senderId)}, but the user has been banned from the bot.`
                                        ),
                                        mentions: [senderJid]
                                    });
                                }
                            }
                        }

                        groupDb.save();
                    }

                    // Anti tag status
                    if (groupDb?.option?.antitagsw) {
                        const checkMedia = msg.message?.protocolMessage?.type === 25;
                        if (!!checkMedia) {
                            await ctx.reply(tools.msg.info("Don't tag groups on SW, no one cares!"));
                            await ctx.deleteMessage(ctx.id, msg.key);
                            await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                        }
                    }

                    // Anti toxic
                    if (groupDb?.option?.antitoxic) {
                        const toxicRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;
                        if (msg.body && toxicRegex.test(msg.body)) {
                            await ctx.reply(tools.msg.info("Don't be toxic!"));
                            await ctx.deleteMessage(ctx.id, msg.key);
                            await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                        }
                    }
                }
            }

            // Private chat handling
            if (isPrivate) {
                if (!isCmd || isCmd?.didyoumean)
                    log.info(
                        `PM | ${senderId}`
                    );
            }
        }
    });
};

module.exports.handleWarning = handleWarning;