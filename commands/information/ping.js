const os = require("node:os");

module.exports = {
    name: "ping",
    aliases: ["p", "speed", "speedtest"],
    category: "information",

    code: async (ctx) => {
        try {

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // RESPONSE TIME
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const startTime   = performance.now();
            const pongMsg     = await ctx.reply(tools.msg.info("Measuring performance..."));
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

            const bar = (percent, size = 10) => {
                const filled = Math.round((percent / 100) * size);
                return "█".repeat(filled) + "░".repeat(size - filled);
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
            // BOT PROFILE PIC
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const ppUrl = await ctx._client.profilePictureUrl(
                ctx._client.user.id.replace(/:\d+@/, "@"), "image"
            ).catch(() => config.bot.thumbnail);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // EDIT INITIAL MESSAGE
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            await ctx.editMessage(
                ctx.id,
                pongMsg.key,
                tools.msg.info(`Pong! ${responseTime} ms`)
            );

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // AIRICH — FLUENT API
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            await new AIRich(ctx.core)

                // Header — product card sebagai banner
                .addProduct({
                    title:       config.bot.name,
                    brand:       "System Monitor",
                    price:       `${responseTime} ms`,
                    sale_price:  pingLabel,
                    product_url: config.bot.groupLink || "https://wa.me",
                    image_url:   ppUrl,
                    icon_url:    ppUrl
                })

                // Response & latency
                .addText(
                    `## ◈ Latency\n\n` +
                    `› Response   : **${responseTime} ms** — ${pingLabel}\n` +
                    `› API Ping   : **${apiLatency} ms**\n` +
                    `› Bot Uptime : ${uptime}`
                )

                // Memory
                .addText(
                    `## ◈ Memory\n\n` +
                    `› Used  : **${fmtRam(usedRam)}** / ${fmtRam(totalRam)}\n` +
                    `› Free  : ${fmtRam(freeRam)}\n` +
                    `› Load  : \`${bar(ramPercent)}\` ${ramPercent}% — ${ramLabel}`
                )

                // CPU
                .addText(
                    `## ◈ Processor\n\n` +
                    `› Model : ${cpuModel}\n` +
                    `› Cores : ${cpuCores} core @ ${cpuSpeed} MHz\n` +
                    `› Load  : \`${bar(cpuLoad)}\` ${cpuLoad}% — ${cpuLabel}`
                )

                // System info — use addTip to make it appear small below
                .addTip(`Platform : ${platform}  ·  Node.js : ${nodeVer}  ·  Server Up : ${serverUp}`)

                // Suggest pills — shortcut turn
                .addSuggest([
                    `${ctx.used.prefix}menu`,
                    `${ctx.used.prefix}ping`,
                    `${ctx.used.prefix}donate`
                ])

                .send(ctx._msg.key.remoteJid, {
                    quoted: ctx._msg
                });

        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};