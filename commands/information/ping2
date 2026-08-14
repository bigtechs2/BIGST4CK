const os = require("node:os");

module.exports = {
    name: "ping2",
    aliases: ["p2", "speed2", "speedtest2"],
    category: "information",

    code: async (ctx) => {
        try {
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // RESPONSE TIME
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const startTime    = performance.now();
            const pongMsg      = await ctx.reply(tools.msg.info("Measuring performance..."));
            const responseTime = (performance.now() - startTime).toFixed(2);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // API LATENCY
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const apiStart   = performance.now();
            await fetch("https://httpbin.org/get").catch(() => null);
            const apiLatency = (performance.now() - apiStart).toFixed(0);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // SYSTEM INFO
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const totalRam   = os.totalmem();
            const freeRam    = os.freemem();
            const usedRam    = totalRam - freeRam;
            const ramPercent = ((usedRam / totalRam) * 100).toFixed(1);

            const cpuModel   = os.cpus()[0]?.model?.trim() || "Unknown";
            const cpuCores   = os.cpus().length;
            const cpuSpeed   = os.cpus()[0]?.speed || 0;
            const loadAvg    = os.loadavg()[0];
            const cpuLoad    = Math.min((loadAvg / cpuCores) * 100, 100).toFixed(1);

            const platform   = `${os.type()} ${os.arch()}`;
            const nodeVer    = process.version;
            const uptime     = tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt);
            const serverUp   = tools.msg.convertMsToDuration(os.uptime() * 1000);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // HELPERS
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const fmtRam = (bytes) => {
                const mb = bytes / 1024 / 1024;
                return mb >= 1024
                    ? `${(mb / 1024).toFixed(2)} GB`
                    : `${mb.toFixed(0)} MB`;
            };

            const pingLabel = responseTime < 500  ? "Excellent"
                            : responseTime < 1000 ? "Good"
                            : responseTime < 2000 ? "Average"
                            : "Poor";

            const ramLabel  = ramPercent < 50 ? "Healthy"
                            : ramPercent < 75 ? "Moderate"
                            : "Critical";

            const cpuLabel  = cpuLoad < 30 ? "Idle"
                            : cpuLoad < 60 ? "Normal"
                            : cpuLoad < 85 ? "Busy"
                            : "Overload";

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // EDIT INITIAL MESSAGE
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            await ctx.editMessage(
                ctx.id,
                pongMsg.key,
                tools.msg.info(`Pong! ${responseTime} ms`)
            );

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // BOOKING CARD — Server Performance
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const ownerNumber = "255636756591";
            const groupLink   = "https://chat.whatsapp.com/JgHII0iCl42JD2mGoJSwji";

            await ctx.core.relayMessage(ctx._msg.key.remoteJid, {
                messageContextInfo: {
                    threadId: [],
                    deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: {
                    header: {
                        title: "Server Performance",
                        hasMediaAttachment: false
                    },
                    body: {
                        text: `*Performance Bot*\n\n` +
                            `› Response: ${responseTime} ms — ${pingLabel}\n` +
                            `› API Ping: ${apiLatency} ms\n` +
                            `› RAM: ${fmtRam(usedRam)} / ${fmtRam(totalRam)} (${ramPercent}%)\n` +
                            `› CPU Load: ${cpuLoad}% — ${cpuLabel}\n` +
                            `› Bot Uptime: ${uptime}`
                    },
                    footer: { text: config.msg.footer || `© ${config.bot.name}` },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "booking_confirmation",
                            buttonParamsJson: JSON.stringify({
                                start_datetime: new Date().toISOString(),
                                end_datetime: new Date(Date.now() + 600000).toISOString(),
                                location: "Tanzania",
                                booking_url: groupLink,
                                phone_number: ownerNumber,
                                booking_management_url: groupLink,
                                description:
                                    `› CPU: ${cpuModel}\n` +
                                    `› Cores: ${cpuCores} @ ${cpuSpeed} MHz\n` +
                                    `› Platform: ${platform}\n` +
                                    `› Node.js: ${nodeVer}\n` +
                                    `› Server Up: ${serverUp}`,
                                email: "",
                                display_text: "Full Specs",
                                display_content: {
                                    display_language: "en",
                                    display_meeting_type: "Server Information",
                                    display_bottom_sheet_header: "Server Details",
                                    display_add_to_calendar_cta_text: "SERVER",
                                    display_view_on_maps_cta_text: "Server Location",
                                    display_manage_booking_cta_text: "Join Group",
                                    display_manage_booking_not_supported_text: "Server Info",
                                    display_read_more: "View Details"
                                }
                            })
                        }],
                        messageParamsJson: "{}"
                    },
                    contextInfo: {
                        mentionedJid: [],
                        groupMentions: [],
                        statusAttributions: [],
                        stanzaId: "StatusBiz",
                        participant: "0@s.whatsapp.net",
                        quotedMessage: {
                            contactMessage: {
                                displayName: config.bot.name,
                                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${config.bot.name} Bot\nFN:${config.bot.name} Bot\nORG:${config.bot.name};\nTEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\nEND:VCARD`
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