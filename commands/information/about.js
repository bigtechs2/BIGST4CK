const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "about",
    aliases: ["bot", "infobot"],
    category: "information",

    code: async (ctx) => {
        try {
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // SAFE DEFAULTS
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const botName = config?.bot?.name || "BIGST4CK";
            const ownerName = config?.owner?.name || "bigmanjtech™";
            const version = require("../../package.json").version || "8.0.3";
            const mode = tools?.msg?.ucwords?.(ctx?.db?.bot?.mode) || "self";
            const uptime = tools?.msg?.convertMsToDuration?.(Date.now() - (ctx?.me?.readyAt || Date.now())) || "N/A";

            // ── Database size ──
            let dbSize = "N/A";
            try {
                const dbDir = ctx?.bot?.databaseDir;
                if (dbDir && fs.existsSync(dbDir)) {
                    const files = fs.readdirSync(dbDir);
                    const total = files.reduce((sum, file) => {
                        try {
                            return sum + fs.statSync(path.join(dbDir, file)).size;
                        } catch (_) { return sum; }
                    }, 0);
                    dbSize = tools?.msg?.formatSize?.(total / 1024) || `${(total / 1024).toFixed(2)} KB`;
                }
            } catch (_) {}

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // BUILD STATS
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const stats =
                `› ${formatter?.bold?.("Bot") || "Bot"}: ${botName}\n` +
                `› ${formatter?.bold?.("Version") || "Version"}: ${version}\n` +
                `› ${formatter?.bold?.("Owner") || "Owner"}: ${ownerName}\n` +
                `› ${formatter?.bold?.("Mode") || "Mode"}: ${mode}\n` +
                `› ${formatter?.bold?.("Uptime") || "Uptime"}: ${uptime}\n` +
                `› ${formatter?.bold?.("Database") || "Database"}: ${dbSize} (Simpl.DB with JSON)\n` +
                `› ${formatter?.bold?.("Library") || "Library"}: @bigmanktech (Fork of @bigtechs1/2)`;

            const fullBody =
                `Hello! I am a WhatsApp bot named ${botName}, owned by ${ownerName}. I can perform many commands, such as creating stickers, using AI for various tasks, and other useful features. I'm here to entertain and assist you!\n\n` +
                stats;

            const prefix = ctx?.used?.prefix || ".";
            const thumbnail = "https://x.xcute.workers.dev/f/images/cf97fd48b7cf.jpg";
            const footer = config?.msg?.footer || "© BIGST4CK by bigmanjtech™";

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // SEND WITH HORIZONTAL QUICK-REPLY BUTTONS
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            if (typeof ButtonV2 !== "undefined" && ButtonV2) {
                await new ButtonV2(ctx.core)
                    .setTitle(`🤖 ${botName} by bigmanjtech™`)
                    .setBody(fullBody)
                    .setFooter(footer)
                    .setThumbnail(thumbnail)
                    // ─── Horizontal buttons (type 1 = quick reply) ───
                    .addRawButton({
                        buttonText: { displayText: "dev" },
                        buttonId: `${prefix}owner`,
                        type: 1
                    })
                    .addRawButton({
                        buttonText: { displayText: "dev group" },
                        buttonId: `${prefix}botgroup`,
                        type: 1
                    })
                    .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });
            } else {
                // Fallback: plain text
                await ctx.reply(
                    `${fullBody}\n\n` +
                    `dev: ${prefix}owner\n` +
                    `dev group: ${prefix}botgroup\n\n` +
                    `${footer}`
                );
            }

        } catch (error) {
            console.error("[about] Error:", error);
            try {
                await ctx.reply(
                    `🤖 About ${config?.bot?.name || "BIGST4CK"}\n` +
                    `Owner: ${config?.owner?.name || "bigmanjtech™"}\n` +
                    `Version: ${require("../../package.json").version || "8.0.3"}\n\n` +
                    `❌ An error occurred while loading full details.\n` +
                    `Please try again later.`
                );
            } catch (_) {}
        }
    }
};