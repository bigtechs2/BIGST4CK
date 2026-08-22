module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    code: async (ctx) => {
        try {
            const uptimeMs = Date.now() - ctx.me.readyAt;

            // ── Break down ──
            const ms = uptimeMs % 1000;
            const totalSeconds = Math.floor(uptimeMs / 1000);
            const seconds = totalSeconds % 60;
            const totalMinutes = Math.floor(totalSeconds / 60);
            const minutes = totalMinutes % 60;
            const totalHours = Math.floor(totalMinutes / 60);
            const hours = totalHours % 24;
            const days = Math.floor(totalHours / 24);

            // ── Build rows – only add metric if > 0 ──
            const rows = [
                ["Metric", "Value"],
                ["Bot Name", config?.bot?.name || "BIGST4CK"]
            ];

            if (days > 0) rows.push(["Days", `${days}`]);
            if (hours > 0) rows.push(["Hours", `${hours}`]);
            if (minutes > 0) rows.push(["Minutes", `${minutes}`]);
            if (seconds > 0) rows.push(["Seconds", `${seconds}`]);
            if (ms > 0) rows.push(["Milliseconds", `${ms}`]);

            // ── Body message ──
            let body;
            if (rows.length === 2) {
                body = `🤖 Bot has been active for **less than a second**.`;
            } else {
                body = `🤖 Bot has been active for:\n_Here's the detailed breakdown._`;
            }

            // ── Send via AIRich (NIXCODE style) ──
            if (typeof AIRich !== "undefined" && AIRich) {
                const rich = new AIRich(ctx.core)
                    .setTitle(`⏱️ ${config?.bot?.name || 'Bot'} Uptime`)
                    .setBody(body)
                    .addTable(rows)
                    .setFooter(config?.msg?.footer || "© BIGST4CK by bigmanjtech™");

                // ── If no table, show a different message ──
                if (rows.length === 2) {
                    rich.setBody(body + "\n\n_Enjoy your freshly started bot!_");
                }

                await rich.send(ctx._msg.key.remoteJid, { quoted: ctx._msg });
            } else {
                // Fallback plain text
                let fallback = "⏱️ Uptime\n";
                rows.slice(1).forEach(row => {
                    fallback += `${row[0]}: ${row[1]}\n`;
                });
                if (rows.length === 2) fallback += "Less than a second.";
                await ctx.reply(fallback);
            }

        } catch (error) {
            console.error("[uptime] Error:", error);
            await ctx.reply("❌ Failed to retrieve uptime.");
        }
    }
};