// commands/donate.js
module.exports = {
    name: "donate",
    aliases: ["donasi", "support"],
    category: "information",

    code: async (ctx) => {
        const prefix = ctx.used.prefix;
        const ownerNumber = config.owner?.id || "255636756591";
        const donateLink = "https://bigdonate.onrender.com";

        const msg =
            `› SUPPORT ${config.bot?.name || "BIGST4CK"}\n\n` +
            `› Donate Online\n` +
            `  ${donateLink}\n\n` +
            `› Manual (All Networks)\n` +
            `  Send to: ${ownerNumber}\n\n` +
            `› Every coin helps! 🙏\n\n`;

        if (typeof ButtonV2 !== "undefined" && ButtonV2) {
            await new ButtonV2(ctx.core)
                .setTitle("› Donate")
                .setBody(msg)
                .setFooter("© BIGST4CK by bigmanjtech™ with ♥︎")
                .setThumbnail("https://files.catbox.moe/0hmdof.png")
                .addButton("› Donate Online", `${prefix}open ${donateLink}`)
                .addButton("› Copy Number", `${prefix}copy ${ownerNumber}`)
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });
        } else {
            await ctx.reply(msg);
        }
    }
};