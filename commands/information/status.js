const os = require("node:os");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "status",
    aliases: ["stats", "botinfo"],
    category: "information",

    code: async (ctx) => {
        try {
            const loadingMsg = await ctx.reply(tools.msg.info("Loading status..."));

            const userDb = ctx.db.user || {};
            const isOwner = ctx.sender.isOwner ? ctx.sender.isOwner() : false;
            const isPremium = userDb?.premium || false;
            const isVerified = userDb?.verified || false;

            let statusText = "";
            let badgeText = "";

            if (isOwner && isPremium && isVerified) {
                statusText = "VOP 💲";
                badgeText = "VOP 💲";
            } else {
                if (isOwner) {
                    statusText = "🍁 Owner";
                    badgeText = "🍁 Owner";
                } else if (isPremium) {
                    statusText = "⭐ Premium";
                    badgeText = "⭐ Premium";
                } else {
                    statusText = "Freemium";
                    badgeText = "Freemium";
                }
                if (isVerified && !isOwner) {
                    statusText += " 🟢";
                    badgeText += " 🟢 Verified";
                }
            }

            const level = userDb?.level || 0;
            const xp = userDb?.xp || 0;
            const xpMax = 100;
            const coin = isOwner || isPremium ? "Unlimited" : (userDb?.coin || 0);
            const registered = userDb?.registeredDate || "2026-01-15";
            const lastActive = "Today at 14:30";
            const commandsUsed = userDb?.commandsUsed || 1247;

            const uptimeMs = Date.now() - ctx.me.readyAt;
            const totalRam = os.totalmem();
            const freeRam = os.freemem();
            const usedRam = totalRam - freeRam;
            const ramPercent = ((usedRam / totalRam) * 100).toFixed(0);
            const cpuCores = os.cpus().length;
            const loadAvg = os.loadavg()[0];
            const cpuLoad = Math.min((loadAvg / cpuCores) * 100, 100).toFixed(0);
            const ping = 45;

            const formatRam = (bytes) => {
                const mb = bytes / 1024 / 1024;
                return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(0)} MB`;
            };

            const formatUptime = (ms) => {
                const seconds = Math.floor(ms / 1000);
                const days = Math.floor(seconds / 86400);
                const hours = Math.floor((seconds % 86400) / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                const millis = ms % 1000;
                let parts = [];
                if (days > 0) parts.push(`${days}d`);
                if (hours > 0) parts.push(`${hours}h`);
                if (minutes > 0) parts.push(`${minutes}m`);
                if (secs > 0) parts.push(`${secs}s`);
                if (millis > 0) parts.push(`${millis}ms`);
                return parts.join(" ") || "0ms";
            };

            const createBar = (percent, maxBlocks = 8) => {
                const filled = Math.round((percent / 100) * maxBlocks);
                const empty = maxBlocks - filled;
                return "█".repeat(Math.min(filled, maxBlocks)) + "░".repeat(Math.min(empty, maxBlocks));
            };

            const xpBar = createBar((xp / xpMax) * 100, 8);
            const cpuBar = createBar(parseInt(cpuLoad), 10);
            const ramBar = createBar(parseInt(ramPercent), 8);

            let dbSize = "139.90 Bytes";
            try {
                const dbDir = ctx.bot?.databaseDir;
                if (dbDir && fs.existsSync(dbDir)) {
                    const files = fs.readdirSync(dbDir);
                    const totalBytes = files.reduce((sum, file) => {
                        try {
                            return sum + fs.statSync(path.join(dbDir, file)).size;
                        } catch (_) { return sum; }
                    }, 0);
                    dbSize = totalBytes > 0
                        ? totalBytes < 1024 ? `${totalBytes} Bytes` : `${(totalBytes / 1024).toFixed(2)} KB`
                        : "N/A";
                }
            } catch (_) {}

            const totalCmds = ctx.bot?.cmd?.size || 289;

            let activeUsers = 42;
            let totalGroups = 3;
            try {
                if (ctx.db?.users?.totalEntries) activeUsers = ctx.db.users.totalEntries;
                const allGroups = await ctx.core.groupFetchAllParticipating().catch(() => ({}));
                const realGroups = Object.values(allGroups).filter(
                    g => !g.announce && !g.isCommunity && !g.isCommunityAnnounce
                );
                totalGroups = realGroups.length;
            } catch (_) {}

            const mode = tools.msg.ucwords(ctx.db.bot?.mode || "public");

            const statusDescription =
                `✧ *BIGST4CK BOT* ✧\n\n` +
                `👤 *USER PROFILE*\n` +
                `  ▸ Status: ${statusText}\n` +
                `  ▸ Level: Lv.${level} ${xpBar} ${xp}/${xpMax} XP\n` +
                `  ▸ Coin: ${coin}\n` +
                `  ▸ Registered: ${registered}\n` +
                `  ▸ Last Active: ${lastActive}\n` +
                `  ▸ Commands Used: ${commandsUsed.toLocaleString()}\n` +
                `  ▸ Badges: ${badgeText}\n\n` +
                `🖥️ *SYSTEM STATUS*\n` +
                `  ▸ Status: Online\n` +
                `  ▸ Mode: ${mode}\n` +
                `  ▸ Uptime: ${formatUptime(uptimeMs)}\n` +
                `  ▸ Database: ${dbSize}\n` +
                `  ▸ Commands: ${totalCmds} cmd\n` +
                `  ▸ CPU Load: ${cpuBar} ${cpuLoad}%\n` +
                `  ▸ RAM: ${formatRam(usedRam)}/${formatRam(totalRam)} ${ramBar}\n` +
                `  ▸ Ping: ${ping}ms\n` +
                `  ▸ Active Users: ${activeUsers}\n` +
                `  ▸ Total Groups: ${totalGroups}\n\n` +
                `_Tap "Contact" below to reach the owner._`;

            await ctx.editMessage(
                ctx.id,
                loadingMsg.key,
                tools.msg.info("✅ Status loaded!")
            );

            const ownerNumber = config?.owner?.id || "255636756591";
            const phoneFormatted = ownerNumber.replace(/[^0-9]/g, '');
            const groupLink = config?.bot?.groupLink || "https://chat.whatsapp.com/FxEYZl2UyzAEI2yhaH34Ye";
            const footer = config?.msg?.footer || `© ${config?.bot?.name || "BIGST4CK"}`;

            let profilePicBuffer = null;
            try {
                const senderJid = ctx.sender.jid;
                const picUrl = await ctx.core.profilePictureUrl(senderJid, 'image').catch(() => null);
                if (picUrl) {
                    const response = await fetch(picUrl);
                    if (response.ok) {
                        const arrayBuffer = await response.arrayBuffer();
                        profilePicBuffer = Buffer.from(arrayBuffer);
                    }
                }
            } catch (_) {}

            const defaultImage = "https://img.icons8.com/color/96/000000/user.png";

            await ctx.core.relayMessage(ctx._msg.key.remoteJid, {
                messageContextInfo: {
                    threadId: [],
                    deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: {
                    header: {
                        title: "📊 Status",
                        hasMediaAttachment: true,
                        imageMessage: profilePicBuffer
                            ? { image: profilePicBuffer, mimetype: "image/jpeg" }
                            : { url: defaultImage }
                    },
                    body: {
                        text: `*Full Status*\n\n` +
                            `› User: ${ctx.sender.pushName || "Unknown"}\n` +
                            `› Status: ${statusText}\n` +
                            `› Level: Lv.${level} (${xp}/${xpMax} XP)\n` +
                            `› Commands Used: ${commandsUsed.toLocaleString()}\n` +
                            `› Bot Uptime: ${formatUptime(uptimeMs)}`
                    },
                    footer: { text: footer },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "booking_confirmation",
                            buttonParamsJson: JSON.stringify({
                                start_datetime: new Date().toISOString(),
                                end_datetime: new Date(Date.now() + 600000).toISOString(),
                                location: "BIGST4CK",
                                booking_url: groupLink,
                                phone_number: phoneFormatted,
                                booking_management_url: `https://wa.me/${phoneFormatted}`,
                                description: statusDescription,
                                email: "",
                                display_text: "📊 View Full Status",
                                display_content: {
                                    display_language: "en",
                                    display_meeting_type: "Status Information",
                                    display_bottom_sheet_header: "✧ BIGST4CK STATUS ✧",
                                    display_add_to_calendar_cta_text: "STATUS",
                                    display_view_on_maps_cta_text: "View Profile",
                                    display_manage_booking_cta_text: "📱 Contact",
                                    display_manage_booking_not_supported_text: "Status Info",
                                    display_read_more: "View Details"
                                }
                            })
                        }],
                        messageParamsJson: "{}"
                    },
                    contextInfo: {
                        mentionedJid: [ctx.sender.jid],
                        groupMentions: [],
                        statusAttributions: [],
                        stanzaId: "StatusBiz",
                        participant: "0@s.whatsapp.net",
                        quotedMessage: {
                            contactMessage: {
                                displayName: config?.bot?.name || "BIGST4CK",
                                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${config?.bot?.name || "BIGST4CK"} Bot\nFN:${config?.bot?.name || "BIGST4CK"} Bot\nORG:${config?.bot?.name || "BIGST4CK"};\nTEL;type=CELL;type=VOICE;waid=${phoneFormatted}:${phoneFormatted}\nEND:VCARD`
                            }
                        },
                        remoteJid: "status@broadcast"
                    }
                }
            }, {
                additionalNodes: [{
                    tag: "biz",
                    attrs: {},
                    content: [{
                        tag: "interactive",
                        attrs: { type: "native_flow", v: "1" },
                        content: [{ tag: "native_flow", attrs: { v: "9", name: "mixed" } }]
                    }]
                }]
            });

        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};