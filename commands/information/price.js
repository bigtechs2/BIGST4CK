// commands/price.js
module.exports = {
    name: "price",
    aliases: ["belibot", "harga", "sewa", "sewabot", "pricing"],
    category: "information",

    code: async (ctx) => {
        const prefix = ctx.used.prefix;
        const ownerNumber = config.owner?.id || "255636756591";

        const msg =
            `› PRICE LIST\n` +
            `» ${config.bot?.name || "BIGST4CK"}\n\n` +
            `› Bot is FREE on GitHub\n` +
            `› You pay for HOSTING & SUPPORT\n\n` +
            `› Hosting Plans\n` +
            `  Daily   │ 3,000 TZS\n` +
            `  Weekly  │ 8,000 TZS\n` +
            `  Monthly │ 13,000 TZS\n\n` +
            `› Premium Access\n` +
            `  Weekly  │ 5,000 TZS\n` +
            `  Monthly │ 10,000 TZS\n\n` +
            `› Payment: Halopesa · M-Pesa · Airtel · Tigo · Mixx · TTCL\n` +
            `› Contact: wa.me/${ownerNumber}\n\n` +
            `${config.msg?.footer || "© BIGST4CK"}`;

        if (typeof ButtonV2 !== "undefined" && ButtonV2) {
            await new ButtonV2(ctx.core)
                .setTitle("› Price List")
                .setBody(msg)
                .setFooter("Tap to take action")
                .setThumbnail("https://x.xcute.workers.dev/f/images/cf97fd48b7cf.jpg")
                .addButton("› Contact Owner", `${prefix}owner`)
                .addButton("› Donate", `${prefix}donate`)
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });
        } else {
            await ctx.reply(msg);
        }
    }
};