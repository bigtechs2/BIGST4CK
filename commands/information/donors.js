// commands/donatur.js
module.exports = {
    name: "donatur",
    aliases: ["donors"],
    category: "information",

    code: async (ctx) => {
        try {
            const prefix = ctx.used.prefix;

            // ─── Donor List (4 people) ───
            const donaturList = [
                {
                    name: "bigtechs1",
                    role: "Server",
                    image: "https://files.catbox.moe/2qrbb2.png"
                },
                {
                    name: "bigtechs2",
                    role: "Creator",
                    image: "https://files.catbox.moe/qyfsw3.png"
                },
                {
                    name: "datperson",
                    role: "Support",
                    image: "https://files.catbox.moe/d7a2zk.png"
                },
                {
                    name: "zoe",
                    role: "Donor",
                    image: "https://files.catbox.moe/p5h9c9.png"
                }
            ];

            // ─── Top Donor ───
            const top = donaturList[0];
            const rest = donaturList.slice(1);

            // ─── Full List Text ───
            const listText =
                donaturList
                    .map((d, i) => {
                        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
                        return `${medal} *${d.name}* — ${d.role}`;
                    })
                    .join("\n");

            await new AIRich(ctx.core)
                // ─── Top Donor ───
                .addProduct({
                    title: top.name,
                    brand: top.role,
                    price: "#1 All Time",
                    sale_price: "♡ Thank you",
                    url: config.bot?.groupLink || "https://wa.me",
                    image: top.image,
                    icon: top.image
                })

                // ─── Other Donors (3) ───
                .addProduct(rest.map((d, i) => ({
                    title: d.name,
                    brand: d.role,
                    price: `#${i + 2}`,
                    sale_price: "",
                    url: config.bot?.groupLink || "https://wa.me",
                    image: d.image,
                    icon: d.image
                })))

                // ─── Full List ───
                .addText(
                    `\`Hall of Fame\` 🏆\n` +
                    `${listText}\n\n` +
                    `These are the people who have helped keep this bot alive.\n` +
                    `Without them, this journey wouldn't have gone this far.\n\n` +
                    `Your name could be here too — no matter how small,\n` +
                    `your support is real and deeply appreciated. ♡`
                )

                // ─── Tip ───
                .addTip("_Regards: © BIGST4CK_")

                // ─── Quick Actions ───
                .addSuggest([
                    `${prefix}donate`,
                    `${prefix}price`,
                    `${prefix}owner`
                ])

                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};