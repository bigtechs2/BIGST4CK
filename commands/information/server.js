const os = require("node:os");

module.exports = {
    name: "server",
    category: "information",

    code: async (ctx) => {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const cpus = os.cpus();

            // ── Build stats text ──
            const stats =
                `› ${formatter.bold("OS")}: ${os.type()} (${os.platform()})\n` +
                `› ${formatter.bold("Arch")}: ${os.arch()}\n` +
                `› ${formatter.bold("Release")}: ${os.release()}\n` +
                `› ${formatter.bold("Host")}: ${os.hostname()}\n` +
                "\n" +
                `› ${formatter.bold("Memory Used")}: ${tools.msg.formatSize(usedMem)}\n` +
                `› ${formatter.bold("Free")}: ${tools.msg.formatSize(freeMem)}\n` +
                `› ${formatter.bold("Total")}: ${tools.msg.formatSize(totalMem)}\n` +
                "\n" +
                `› ${formatter.bold("CPU Model")}: ${cpus[0].model}\n` +
                `› ${formatter.bold("CPU Speed")}: ${cpus[0].speed} MHz\n` +
                `› ${formatter.bold("CPU Cores")}: ${cpus.length}\n` +
                `› ${formatter.bold("Load Average")}: ${os.loadavg().map(avg => avg.toFixed(2)).join(", ")}\n` +
                "\n" +
                `› ${formatter.bold("Node.js Version")}: ${process.version}\n` +
                `› ${formatter.bold("Exec Path")}: ${process.execPath}\n` +
                `› ${formatter.bold("PID")}: ${process.pid}\n` +
                "\n" +
                `› ${formatter.bold("Bot Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                `› ${formatter.bold("Database")}: ${ctx.db.users.totalEntries} users, ${ctx.db.groups.totalEntries}/${Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id).length} groups\n` +
                `› ${formatter.bold("Library")}: @bigmanjtech™ (Fork of @bigtech2/1)`;

            const prefix = ctx?.used?.prefix || ".";
            const thumbnail = "https://x.xcute.workers.dev/f/images/cf97fd48b7cf.jpg"; // Reuse your about thumbnail
            const footer = config?.msg?.footer || "© BIGST4CK by bigmanjtech™";

            // ── Check if ButtonV2 is available ──
            if (typeof ButtonV2 !== "undefined" && ButtonV2) {
                await new ButtonV2(ctx.core)
                    .setTitle(`BIGST4CK STATUS`)
                    .setBody(stats)
                    .setFooter(footer)
                    .setThumbnail(thumbnail)
                    .addButton("dev store", `${prefix}store`)
                    .addButton("dev", `${prefix}owner`)
                    .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });
            } else {
                // Fallback: plain text with buttons as text suggestions
                await ctx.reply(
                    `🖥️ *BIGST4CK STATUS*\n\n${stats}\n\n` +
                    `Store: ${prefix}store\nDev: ${prefix}owner\n\n${footer}`
                );
            }

        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};