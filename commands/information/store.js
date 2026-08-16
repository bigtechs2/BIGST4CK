// commands/store.js
module.exports = {
    name: "store",
    aliases: ["shop", "storage"],
    category: "main",

    code: async (ctx) => {
        try {
            const prefix = ctx.used.prefix;

            // ─── Storage Packages ───
            const storeList = [
                {
                    name: "1GB Storage",
                    role: "Plan",
                    price: "1,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/c4wfmk.png"
                },
                {
                    name: "2GB Storage",
                    role: "Plan",
                    price: "2,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/amux6f.png"
                },
                {
                    name: "3GB Storage",
                    role: "Plan",
                    price: "3,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/lcw5er.png"
                },
                {
                    name: "4GB Storage",
                    role: "Plan",
                    price: "4,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/rnbpe5.png"
                },
                {
                    name: "5GB Storage",
                    role: "Plan",
                    price: "5,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/c64xmt.png"
                },
                {
                    name: "6GB Storage",
                    role: "Plan",
                    price: "6,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/2g04ta.png"
                },
                {
                    name: "7GB Storage",
                    role: "Plan",
                    price: "7,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/ehisz1.png"
                },
                {
                    name: "8GB Storage",
                    role: "Plan",
                    price: "8,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/pzbhcb.png"
                },
                {
                    name: "9GB Storage",
                    role: "Plan",
                    price: "9,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/xo9t0z.png"
                },
                {
                    name: "10GB Storage",
                    role: "Plan",
                    price: "10,000 TZS",
                    sale_price: "Buy Now",
                    image: "https://files.catbox.moe/41k8cb.png"
                },
                {
                    name: "Unlimited Storage",
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
                    `\`BIGST4CK Storage Store\` 📦\n` +
                    `${listText}\n\n` +
                    `Choose a storage plan that fits your needs.\n` +
                    `All plans include:\n` +
                    `» 24/7 Uptime\n` +
                    `» Premium Support\n` +
                    `» Fast Speeds\n` +
                    `» Secure Backup\n\n` +
                    `💡 *Upgrade anytime!* Contact the owner for details.\n\n` +
                    `Your data is safe with us. ♡`
                )

                // ─── Tip ───
                .addTip("_Regards: © BIGST4CK_")

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