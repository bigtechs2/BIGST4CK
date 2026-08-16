// commands/store.js
module.exports = {
    name: "store",
    aliases: ["shop", "servers", "hosting"],
    category: "information",

    code: async (ctx) => {
        try {
            const prefix = ctx.used.prefix;

            // ─── Pterodactyl Server Plans ───
            const storeList = [
                {
                    name: "1GB RAM Server",
                    role: "Pterodactyl",
                    price: "1,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/c4wfmk.png"
                },
                {
                    name: "2GB RAM Server",
                    role: "Pterodactyl",
                    price: "2,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/amux6f.png"
                },
                {
                    name: "3GB RAM Server",
                    role: "Pterodactyl",
                    price: "3,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/lcw5er.png"
                },
                {
                    name: "4GB RAM Server",
                    role: "Pterodactyl",
                    price: "4,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/rnbpe5.png"
                },
                {
                    name: "5GB RAM Server",
                    role: "Pterodactyl",
                    price: "5,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/c64xmt.png"
                },
                {
                    name: "6GB RAM Server",
                    role: "Pterodactyl",
                    price: "6,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/2g04ta.png"
                },
                {
                    name: "7GB RAM Server",
                    role: "Pterodactyl",
                    price: "7,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/ehisz1.png"
                },
                {
                    name: "8GB RAM Server",
                    role: "Pterodactyl",
                    price: "8,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/pzbhcb.png"
                },
                {
                    name: "9GB RAM Server",
                    role: "Pterodactyl",
                    price: "9,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/xo9t0z.png"
                },
                {
                    name: "10GB RAM Server",
                    role: "Pterodactyl",
                    price: "10,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/41k8cb.png"
                },
                {
                    name: "Unlimited RAM Server",
                    role: "Premium",
                    price: "25,000 TZS",
                    sale_price: "🔥 Best Deal",
                    image: "https://files.catbox.moe/k8kuqu.png"
                }
            ];

            // ─── Top Package ───
            const top = storeList[0];
            const rest = storeList.slice(1);

            // ─── Full List Text ───
            const listText =
                storeList
                    .map((item, i) => {
                        const num = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
                        return `${num} *${item.name}* — ${item.price}`;
                    })
                    .join("\n");

            await new AIRich(ctx.core)
                // ─── Top Package ───
                .addProduct({
                    title: top.name,
                    brand: top.role,
                    price: top.price,
                    sale_price: top.sale_price,
                    url: config.bot?.groupLink || "https://wa.me",
                    image: top.image,
                    icon: top.image
                })

                // ─── Other Packages ───
                .addProduct(rest.map((item) => ({
                    title: item.name,
                    brand: item.role,
                    price: item.price,
                    sale_price: item.sale_price,
                    url: config.bot?.groupLink || "https://wa.me",
                    image: item.image,
                    icon: item.image
                })))

                // ─── Full List ───
                .addText(
                    `\`BIGST4CK Pterodactyl Server Store\` 🖥️\n` +
                    `${listText}\n\n` +
                    `High-performance Pterodactyl servers hosted on BigPanel.\n` +
                    `All plans include:\n` +
                    `» Full Root Access\n` +
                    `» 24/7 Uptime\n` +
                    `» Free SSL\n` +
                    `» Dedicated IP\n` +
                    `» One-Click Apps\n` +
                    `» Instant Setup\n\n` +
                    `💡 *Upgrade anytime!* Contact the owner for custom plans.\n\n` +
                    `Your server, your rules. ♥︎`
                )

                // ─── Tip ───
                .addTip("bigpannel: © BIGST4CK by bigmanjtech™")

                // ─── Quick Actions ───
                .addSuggest([
                    `${prefix}buy`,
                    `${prefix}price`,
                    `${prefix}owner`
                ])

                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};