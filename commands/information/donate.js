module.exports = {
    name: "donate",
    aliases: ["donasi", "support"],
    category: "information",
    permissions: { coin: 0 },
    code: async (ctx) => {
        try {
            const ownerNumber = config?.owner?.id || "255636756591";
            const phoneFormatted = ownerNumber.replace(/[^0-9]/g, '');
            const donateUrl = "https://bigdonate.onrender.com";
            const footer = config?.msg?.footer || `© ${config?.bot?.name || "BIGST4CK"}`;
            const thumbnail = config?.bot?.thumbnail || "https://files.catbox.moe/0hmdof.png";

            // ── Body (short, bold) ──
            const bodyText = `» *SUPPORT BIGST4CK*`;

            // ── Footer (detailed donation info) ──
            const footerText =
                `› Your donation helps keep the bot alive and supports ongoing development.\n\n` +
                `› Every contribution matters – no amount is too small.\n\n` +
                `› _Thank you for your support! ♡_\n\n` +
                `› *Tip:* Tap a button below to get started.\n\n` +
                `© BIGST4CK by bigmanjtech™`;

            // ── Send with Button (not ButtonV2) ──
            await new Button(ctx.core)
                .setTitle("donate")
                .setBody(bodyText)
                .setFooter(footerText)   // ← long detailed text in footer
                .setImage(thumbnail)
                .addUrl("contact dev", `https://wa.me/${phoneFormatted}`, false)
                .addUrl("donate now", donateUrl, false)
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            console.error("[donate] Error:", error);
            await ctx.reply("❌ Failed to load donation info.");
        }
    }
};