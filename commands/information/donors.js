// commands/donatur.js
module.exports = {
    name: "dona",
    aliases: ["donors"],
    category: "information",

    code: async (ctx) => {
        try {
            const prefix = ctx.used.prefix;

            // ─── Donor List ───
            const donaturList = [
                {
                    name: "bigtechs1",
                    role: "Server",
                    image: "https://x.xcute.workers.dev/f/images/399f8732721b.jpg"
                },
                {
                    name: "bigtechs2",
                    role: "Creator",
                    image: "https://x.xcute.workers.dev/f/images/738d07bc5e5b.jpg"
                },
                {
                    name: "datperson",
                    role: "Support",
                    image: "https://x.xcute.workers.dev/f/images/a129964be425.jpg"
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

                // ─── Other Donors ───
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