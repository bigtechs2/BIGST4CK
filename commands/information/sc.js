// commands/sc.js
module.exports = {
    name: "sc",
    aliases: ["script", "source", "sourcecode"],
    category: "information",

    code: async (ctx) => {
        const prefix = ctx.used.prefix;
        const repoLink = "https://github.com/bigtechs2/BIGST4CK"; // if you don't remove this thank you!
        const imageUrl = "https://files.catbox.moe/0hmdof.png";

        const msg =
            `› SOURCE CODE\n\n` +
            `› Repository\n` +
            `  ${repoLink}\n\n` +
            `› Bot is FREE & Open Source\n` +
            `› Star ⭐ & Fork 🍴if you liked the project!\n\n`;
          

        if (typeof ButtonV2 !== "undefined" && ButtonV2) {
            await new ButtonV2(ctx.core)
                .setTitle("› BIGST4CK Script")
                .setBody(msg)
                .setFooter(`© ${config.bot?.name || "BIGST4CK"}`) 
                .setThumbnail(imageUrl)
                .addButton("› Dev", `${prefix}owner`)
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });
        } else {
            await ctx.reply(`${msg}\n\n🔗 ${repoLink}`);
        }
    }
};