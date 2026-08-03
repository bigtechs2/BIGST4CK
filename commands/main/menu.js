const fs   = require("node:fs");
const path = require("node:path");
const os   = require("node:os");

module.exports = {
    name: "menu",
    aliases: ["allmenu", "help"],
    category: "main",

    code: async (ctx) => {
        try {
            const { cmd } = ctx.bot;

            // ========================================
            // CATALOG (productMessage)
            // ========================================
            const Catalog = {
                key: {
                    remoteJid: '0@s.whatsapp.net',
                    fromMe: false,
                    id: 'Bigmanj Catalog',
                    participant: '0@s.whatsapp.net'
                },
                message: {
                    productMessage: {
                        product: {
                            title: '𝐁𝐈𝐆 𝐒𝐓4𝐂𝐊',
                            description: '𝐁𝐈𝐆 𝐒𝐓4𝐂𝐊 𝐛𝐲 𝐛𝐢𝐠𝐦𝐚𝐧𝐣 𝐭𝐞𝐜𝐡',
                            currencyCode: 'BTC',
                            priceAmount1000: 100000000,
                            retailerId: 'BTC100000000',
                            productImageCount: 1
                        },
                        businessOwnerJid: '0@s.whatsapp.net'
                    }
                }
            };

            // ========================================
            // THUMBNAILS
            // ========================================
            const thumbnails = [
                "https://files.catbox.moe/0hmdof.png",
            ];
            const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];

            // ========================================
            // AUDIO
            // ========================================
            const sendAudio = async () => {
                try {
                    const chatJid = ctx._msg.key.remoteJid;
                    const audioUrl = "https://x.xcute.workers.dev/f/audios/2aea7662816c.mp3";

                    const orderContext = {
                        stanzaId: "AC" + require("crypto").randomBytes(8).toString("hex").toUpperCase(),
                        participant: "0@s.whatsapp.net",
                        quotedMessage: {
                            orderMessage: {
                                orderId: "594071395007984",
                                thumbnail: { url: "https://files.catbox.moe/or4jfn.jpg" },
                                itemCount: 9741,
                                status: "INQUIRY",
                                surface: "CATALOG",
                                message: `Command : ${ctx.used.command}`,
                                orderTitle: "ALWAYSKAIZI",
                                sellerJid: "6285727819741@s.whatsapp.net",
                                token: "AR40+xXRlWKpdJ2ILEqtgoUFd45C8rc1CMYdYG/R2KXrSg==",
                                totalAmount1000: "9741",
                                totalCurrencyCode: "IDR"
                            }
                        }
                    };

                    await ctx.core.sendMessage(chatJid, {
                        audio: { url: audioUrl },
                        mimetype: "audio/mpeg",
                        ptt: false,
                        contextInfo: orderContext
                    }, { quoted: ctx._msg });

                } catch (err) {
                    console.error("[Menu Audio] Failed:", err.message);
                }
            };

            // ========================================
            // TAG & HELPERS
            // ========================================
            const tag = {
                "ai-chat":     { label: "AI Chat" },
                "ai-generate": { label: "AI Generate" },
                "ai-misc":     { label: "AI Misc" },
                anime:         { label: "Anime" },
                nsfw:          { label: "NSFW" },
                converter:     { label: "Converter" },
                downloader:    { label: "Downloader" },
                game:          { label: "Game" },
                group:         { label: "Group" },
                primbon:       { label: "Primbon" },
                image:         { label: "Image" },
                maker:         { label: "Maker" },
                profile:       { label: "Profile" },
                search:        { label: "Search" },
                stalker:       { label: "Stalker" },
                tool:          { label: "Tool" },
                owner:         { label: "Owner" },
                information:   { label: "Information" },
                misc:          { label: "Miscellaneous" }
            };

            const getCommands = (categories) => {
                const result = {};
                const allCmds = Array.from(cmd.values());
                categories.forEach(cat => {
                    const filtered = allCmds
                        .filter(c => c.category === cat)
                        .map(c => ({ name: c.name, permissions: c.permissions || {} }));
                    if (filtered.length > 0) result[cat] = filtered;
                });
                return result;
            };

            const formatPerms = (perms) => {
                const badges = [];
                if (perms.coin)    badges.push("ⓒ");
                if (perms.group)   badges.push("Ⓖ");
                if (perms.owner)   badges.push("Ⓞ");
                if (perms.premium) badges.push("Ⓟ");
                if (perms.private) badges.push("ⓟ");
                return badges.length ? ` ${badges.join("")}` : "";
            };

            // ========================================
            // TIME & GREETING
            // ========================================
            const nowEN = new Date(
                new Date().toLocaleString("en-US", { timeZone: "Africa/Nairobi" })
            );
            const hour = nowEN.getHours();
            const greeting =
                hour >= 5  && hour < 11 ? "Good morning"  :
                hour >= 11 && hour < 15 ? "Good afternoon" :
                hour >= 15 && hour < 18 ? "Good afternoon"  :
                                          "Good night";

            const timeEN = nowEN.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            const dateEN = nowEN.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });

            // ========================================
            // SERVER STATUS & HELPERS
            // ========================================
            const cpuLoad  = os.loadavg()[0];
            const cpuCores = os.cpus().length;
            const loadPct  = (cpuLoad / cpuCores) * 100;
            const ramPct   = ((os.totalmem() - os.freemem()) / os.totalmem()) * 100;
            const serverStatus = loadPct > 80 || ramPct > 85 ? "Degraded" : "Online";

            const createBar = (percent, maxBlocks = 8) => {
                const filled = Math.round((percent / 100) * maxBlocks);
                const empty = maxBlocks - filled;
                return "█".repeat(Math.min(filled, maxBlocks)) + "░".repeat(Math.min(empty, maxBlocks));
            };

            const quotes = [
                "Don't forget to .donate to keep the bot online!",
                "Type .help if you're confused.",
                "This bot is free, but the server isn't. Please .donate!",
                "Please use the bot wisely.",
                "New features? Keep checking the group for updates!"
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            const input = ctx.args[0]?.toLowerCase();

            // ========================================
            // CATEGORY MENU / ALL MENU
            // ========================================
            if (input || ctx.used.command === "allmenu") {

                const selectedCats =
                    input === "all" || ctx.used.command === "allmenu"
                        ? Object.keys(tag)
                        : (tag[input] ? [input] : []);

                const commandsData = getCommands(selectedCats);

                if (Object.keys(commandsData).length === 0) {
                    return await ctx.reply("Category not found.");
                }

                let text = "";
                for (const [key, list] of Object.entries(commandsData)) {
                    const { label } = tag[key] || { label: key };
                    text += `┌── ⌗${label}\n`;
                    list.forEach((c, i) => {
                        const isLast = i === list.length - 1;
                        text += `${isLast ? "└•" : "├•"} ${ctx.used.prefix + c.name}${formatPerms(c.permissions)}\n`;
                    });
                    text += "\n";
                }
                text += "ⓒ Coin · Ⓖ Group · Ⓞ Owner · Ⓟ Premium";

                // ─── CATEGORY MENU BUTTONS ───
                await new ButtonV2(ctx.core)
                    .setTitle(config.bot.name)
                    .setSubtitle(`${serverStatus} · ${timeEN}`)
                    .setBody(formatter.monospace(text.trim()))
                    .setFooter(config.msg.footer)
                    .setThumbnail(randomThumbnail)
                    .setContextInfo({
                        stanzaId: Catalog.key.id,
                        participant: Catalog.key.participant,
                        remoteJid: Catalog.key.remoteJid,
                        quotedMessage: Catalog.message
                    })
                    .addButton("📋 Main Menu", `${ctx.used.prefix}menu`)
                    .addButton("📜 All Commands", `${ctx.used.prefix}menu all`)
                    .addRawButton({
                        buttonText: { displayText: "⦂ Navigation" },
                        buttonId: "menu",
                        type: 1,
                        nativeFlowInfo: {
                            name: "single_select",
                            paramsJson: JSON.stringify({
                                title: "Promotion",
                                sections: [{
                                    title: "Built by 𝐛𝐢𝐠",
                                    rows: [
                                        { title: "Main Menu", description: "Open Main Menu", id: `${ctx.used.prefix}menu` },
                                        { title: "All Commands", description: "Tap to Open All Menu", id: `${ctx.used.prefix}menu all` },
                                        { title: "Rent a Boat", description: "View bot rental price packages", id: `${ctx.used.prefix}price` },
                                        { title: "Donation", description: "Good people only", id: `${ctx.used.prefix}donasi` },
                                        { title: "Store ", description: "𝐛𝐢𝐠 𝐬𝐭4𝐜𝐤 Store all Items", id: `${ctx.used.prefix}store` },
                                        { title: "Speedtest", description: "Check performance & specifications Server", id: `${ctx.used.prefix}ping` },
                                        { title: "Contact Owner", description: "Contact the bot owner directly", id: `${ctx.used.prefix}owner` }
                                    ]
                                }]
                            })
                        }
                    })
                    .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

            } else {

                // ========================================
                // MAIN MENU – › STYLE WITH BOLD LABELS
                // ========================================
                const userDb    = ctx.db.user || {};
                const totalCmds = Array.from(cmd.values()).length;

                const isOwner = ctx.sender.isOwner ? ctx.sender.isOwner() : false;
                const isPremium = userDb?.premium || false;

                const statusText = isOwner ? "Owner" : isPremium ? "Premium" : "Freemium";
                const level = userDb?.level || 0;
                const xp = userDb?.xp || 0;
                const xpMax = 100;
                const coin = isOwner || isPremium ? "Unlimited" : (userDb?.coin || 0);
                const registered = userDb?.registeredDate || "2026-01-15";
                const lastActive = "Today at 14:30";
                const commandsUsed = userDb?.commandsUsed || 1247;

                let badges = "";
                if (isOwner) badges += "Owner  ";
                if (isPremium) badges += "Verified  ";
                if (!isOwner && !isPremium) badges += "Freemium";
                if (badges.endsWith(" ")) badges = badges.trim();

                // ── Progress bars ──
                const xpBar = createBar((xp / xpMax) * 100, 8);
                const cpuBar = createBar(Math.min(loadPct, 100), 10);
                const ramBar = createBar(ramPct, 8);

                // ── Database size ──
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

                // ── Active users & groups ──
                let activeUsers = 10000;
                let totalGroups = 10;
                try {
                    if (ctx.db?.users?.totalEntries) activeUsers = ctx.db.users.totalEntries;
                    const allGroups = await ctx.core.groupFetchAllParticipating().catch(() => ({}));
                    const realGroups = Object.values(allGroups).filter(
                        g => !g.announce && !g.isCommunity && !g.isCommunityAnnounce
                    );
                    totalGroups = realGroups.length;
                } catch (_) {}

                // ── Ping ──
                const ping = 5;

                // ── Uptime ──
                const uptimeMs = Date.now() - ctx.me.readyAt;
                const uptime = tools.msg.convertMsToDuration(uptimeMs) || "N/A";

                // ── RAM formatted ──
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const formatRam = (bytes) => {
                    const mb = bytes / 1024 / 1024;
                    return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(0)} MB`;
                };

                const senderNumber = ctx.sender.jid.split("@")[0];

                // ── bodyText: greeting and date ──
                const bodyText =
                    `${greeting}, @${senderNumber}\n` +
                    `${dateEN} · ${timeEN}`;

                // ── footerText: › style with bold labels ──
                const footerText =
                    `*»* *USER*\n` +
                    `  › *Status:* ${statusText}\n` +
                    `  › *Level:* Lv.${level} ${xpBar} ${xp}/${xpMax} XP\n` +
                    `  › *Coin:* ${coin}\n` +
                    `  › *Registered:* ${registered}\n` +
                    `  › *Last Active:* ${lastActive}\n` +
                    `  › *Commands Used:* ${commandsUsed.toLocaleString()}\n` +
                    `  › *Badges:* ${badges}\n` +
                    `\n` +
                    `*»* *SYSTEM*\n` +
                    `  › *Status:* ${serverStatus}\n` +
                    `  › *Mode:* ${tools.msg.ucwords(ctx.db.bot?.mode || "public")}\n` +
                    `  › *Uptime:* ${uptime}\n` +
                    `  › *Database:* ${dbSize}\n` +
                    `  › *Commands:* ${totalCmds} cmd\n` +
                    `  › *CPU Load:* ${cpuBar} ${Math.round(Math.min(loadPct, 100))}%\n` +
                    `  › *RAM:* ${formatRam(usedMem)}/${formatRam(totalMem)} ${ramBar}\n` +
                    `  › *Ping:* ${ping}ms\n` +
                    `  › *Active Users:* ${activeUsers}\n` +
                    `  › *Total Groups:* ${totalGroups}\n\n` +
                    `${randomQuote}\n\n` +
                    `${config.msg.footer}`;

                // ─── MAIN MENU BUTTONS: Store + Navigation ───
                await new ButtonV2(ctx.core)
                    .setTitle(config.bot.name)
                    .setSubtitle(`${serverStatus} · ${timeEN}`)
                    .setBody(bodyText)
                    .setFooter(footerText)
                    .setThumbnail(randomThumbnail)
                    .setContextInfo({
                        mentionedJid: [ctx.sender.jid],
                        stanzaId: Catalog.key.id,
                        participant: Catalog.key.participant,
                        remoteJid: Catalog.key.remoteJid,
                        quotedMessage: Catalog.message
                    })
                    .addButton("♡ Store", `${ctx.used.prefix}store`)
                    .addRawButton({
                        buttonText: { displayText: "☰ Menu" },
                        buttonId: "menu",
                        type: 1,
                        nativeFlowInfo: {
                            name: "single_select",
                            paramsJson: JSON.stringify({
                                title: "Select Category",
                                sections: [
                                    {
                                        title: "Built By bigmanjtech™",
                                        rows: [
                                            { title: "All Commands", description: "Show all commands list", id: `${ctx.used.prefix}menu all` }
                                        ]
                                    },
                                    {
                                        title: "Artificial Intelligence",
                                        rows: [
                                            { title: "AI Chat",     description: "AI Chat Commands",     id: `${ctx.used.prefix}menu ai-chat`     },
                                            { title: "AI Generate", description: "AI Generate Command", id: `${ctx.used.prefix}menu ai-generate` },
                                            { title: "AI Misc",     description: "Misc AI Commands",     id: `${ctx.used.prefix}menu ai-misc`     }
                                        ]
                                    },
                                    {
                                        title: "Utilities",
                                        rows: [
                                            { title: "Downloader", description: "Downloader Menu", id: `${ctx.used.prefix}menu downloader` },
                                            { title: "Tool",       description: "Tool Menu",       id: `${ctx.used.prefix}menu tool`       },
                                            { title: "Search",     description: "Search Menu",     id: `${ctx.used.prefix}menu search`     },
                                            { title: "Converter",  description: "Converter Menu",  id: `${ctx.used.prefix}menu converter`  },
                                            { title: "Stalker",    description: "Stalker Menu",    id: `${ctx.used.prefix}menu stalker`    }
                                        ]
                                    },
                                    {
                                        title: "Entertainment",
                                        rows: [
                                            { title: "Game",    description: "Game Menu",    id: `${ctx.used.prefix}menu game`    },
                                            { title: "Maker",   description: "Maker Menu",   id: `${ctx.used.prefix}menu maker`   },
                                            { title: "Image",   description: "Image Menu",   id: `${ctx.used.prefix}menu image`   },
                                            { title: "Primbon", description: "Primbon Menu", id: `${ctx.used.prefix}menu primbon` },
                                            { title: "Misc",    description: "Misc Menu",    id: `${ctx.used.prefix}menu misc`    }
                                        ]
                                    },
                                    {
                                        title: "Anime & NSFW",
                                        rows: [
                                            { title: "Anime", description: "Anime Menu", id: `${ctx.used.prefix}menu anime` },
                                            { title: "NSFW",  description: "NSFW Menu",  id: `${ctx.used.prefix}menu nsfw`  }
                                        ]
                                    },
                                    {
                                        title: "Social",
                                        rows: [
                                            { title: "Group",       description: "Group Menu",       id: `${ctx.used.prefix}menu group`       },
                                            { title: "Profile",     description: "Profile Menu",     id: `${ctx.used.prefix}menu profile`     },
                                            { title: "Information", description: "Information Menu", id: `${ctx.used.prefix}menu information` }
                                        ]
                                    },
                                    {
                                        title: "Others",
                                        rows: [
                                            { title: "Owner",   description: "Owner Menu",   id: `${ctx.used.prefix}menu owner`   },
                                            { title: "Primbon", description: "Primbon Menu", id: `${ctx.used.prefix}menu primbon` }
                                        ]
                                    }
                                ]
                            })
                        }
                    })
                    .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

                // ========================================
                // SEND AUDIO
                // ========================================
                await sendAudio();
            }

        } catch (e) {
            console.error(e);
            await ctx.reply("❌ An error occurred while displaying the menu.");
        }
    }
};