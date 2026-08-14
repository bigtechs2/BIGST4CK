const os = require("node:os");

module.exports = {
    name: "ping3",
    aliases: ["p3", "speed3"],
    category: "information",

    code: async (ctx) => {
        try {
            const startTime = performance.now();
            const pongMsg = await ctx.reply(tools.msg.info("Measuring performance..."));
            const responseTime = (performance.now() - startTime).toFixed(2);

            const apiStart = performance.now();
            await fetch("https://httpbin.org/get").catch(() => null);
            const apiLatency = (performance.now() - apiStart).toFixed(0);

            const totalRam = os.totalmem();
            const freeRam  = os.freemem();
            const usedRam  = totalRam - freeRam;
            const ramPercent = ((usedRam / totalRam) * 100).toFixed(1);

            const cpuModel  = os.cpus()[0]?.model?.trim() || "Unknown";
            const cpuCores  = os.cpus().length;
            const cpuSpeed  = os.cpus()[0]?.speed || 0;
            const loadAvg   = os.loadavg()[0];
            const cpuLoad   = Math.min((loadAvg / cpuCores) * 100, 100).toFixed(1);

            const platform  = `${os.type()} ${os.arch()}`;
            const nodeVer   = process.version;
            const uptime    = tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt);
            const serverUp  = tools.msg.convertMsToDuration(os.uptime() * 1000);

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

            const pingLabel =
                responseTime < 500  ? "Excellent" :
                responseTime < 1000 ? "Good"      :
                responseTime < 2000 ? "Average"   : "Poor";

            const pingEmoji =
                responseTime < 500  ? "🟢" :
                responseTime < 1000 ? "🟡" :
                responseTime < 2000 ? "🟠" : "🔴";

            const ramLabel =
                ramPercent < 50 ? "Healthy"  :
                ramPercent < 75 ? "Moderate" : "Critical";

            const ramEmoji =
                ramPercent < 50 ? "🟢" :
                ramPercent < 75 ? "🟡" : "🔴";

            const cpuLabel =
                cpuLoad < 30 ? "Idle"    :
                cpuLoad < 60 ? "Normal"  :
                cpuLoad < 85 ? "Busy"    : "Overload";

            const cpuEmoji =
                cpuLoad < 30 ? "🟢" :
                cpuLoad < 60 ? "🟡" :
                cpuLoad < 85 ? "🟠" : "🔴";

            // Bot profile picture — thumbnail kama latex image
            const ppUrl = await ctx.core.profilePictureUrl(
                ctx.core.user.id.replace(/:\d+@/, "@"), "image"
            ).catch(() => config.bot.thumbnail);

            await ctx.editMessage(
                ctx.id,
                pongMsg.key,
                tools.msg.info(`Pong! ${responseTime} ms`)
            );

            await new AIRich(ctx.core)
                .addText(
                    `# ${config.bot.name}\n\n` +

                    // Latex — bot thumbnail inline (kama picha ya mwanamke)
                    `[${config.bot.name}|48|48](${ppUrl})\n\n` +

                    `## ◈ Latency\n\n` +
                    `› Response : **[${responseTime} ms](https://wa.me/${config.owner.id})** ${pingEmoji} ${pingLabel}\n` +
                    `› API Ping : **${apiLatency} ms**\n` +
                    `› Uptime   : ${uptime}\n\n` +

                    `## ◈ Memory\n\n` +
                    `› Used  : **${fmtRam(usedRam)}** / ${fmtRam(totalRam)}\n` +
                    `› Free  : ${fmtRam(freeRam)}\n` +
                    `› Load  : \`${bar(ramPercent)}\` ${ramPercent}% ${ramEmoji} ${ramLabel}\n\n` +

                    `## ◈ Processor\n\n` +
                    `› Model : **[${cpuModel}](https://www.google.com/search?q=${encodeURIComponent(cpuModel)})**\n` +
                    `› Cores : ${cpuCores} core @ ${cpuSpeed} MHz\n` +
                    `› Load  : \`${bar(cpuLoad)}\` ${cpuLoad}% ${cpuEmoji} ${cpuLabel}\n\n` +

                    `## ◈ System\n\n` +
                    `› Platform  : ${platform}\n` +
                    `› [Node.js ${nodeVer}](https://nodejs.org)\n` +
                    `› Server Up : ${serverUp}\n\n` +

                    // Citation — link ya owner
                    `[](https://wa.me/${config.owner.id})`
                )
                .addTip(
                    `_${config.bot.name} · Owned by [${config.owner.name}](https://wa.me/${config.owner.id})_`
                )
                .addSuggest([
                    `${ctx.used.prefix}menu`,
                    `${ctx.used.prefix}ping3`,
                    `${ctx.used.prefix}donate`
                ])
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};