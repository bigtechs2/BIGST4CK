module.exports = {
    name: "store",
    aliases: ["product", "toko"],
    category: "information",
    code: async (ctx) => {
        try {
            const ownerNumber = "255636756591";
            const waLink = `https://wa.me/${ownerNumber}`;

            // ─── Product list ─────────────────────────────────────────────
            const productList = [
                {
                    title: "🛒 BIGST4CK Store",
                    brand: "By bigmanj tech™",
                    price: "",
                    sale_price: "",
                    image: "https://x.xcute.workers.dev/f/images/399f8732721b.jpg"
                },
                {
                    title: "💻 Starter",
                    brand: "1c · 512 MB · 5 GB",
                    price: "5,000 TSh/mo (~2.40 $)",
                    sale_price: "60,000 TSh/yr (~28.80 $) + 3 days free",
                    image: "https://x.xcute.workers.dev/f/images/b8066826a651.jpg"
                },
                {
                    title: "💻 Standard",
                    brand: "1c · 1 GB · 10 GB",
                    price: "10,000 TSh/mo (~4.80 $)",
                    sale_price: "120,000 TSh/yr (~57.60 $) + 3 days free",
                    image: "https://x.xcute.workers.dev/f/images/569c736b8940.jpg"
                },
                {
                    title: "💻 Pro",
                    brand: "2c · 2 GB · 20 GB",
                    price: "15,000 TSh/mo (~10.00 $)",
                    sale_price: "180,000 TSh/yr (~120.00 $) + 5 days free",
                    image: "https://x.xcute.workers.dev/f/images/569c736b8940.jpg"
                },
                {
                    title: "♾️ Infinity",
                    brand: "4c · 8 GB · 100 GB",
                    price: "30,000 TSh/mo (~32.00 $)",
                    sale_price: "360,000 TSh/yr (~384.00 $) + 7 days free",
                    image: "https://x.xcute.workers.dev/f/images/7d90efab1187.jpg"
                },
                {
                    title: "📜 Script Zero Tr4sh v9.2.4",
                    brand: "Premium Script",
                    price: "45,000 TSh (~18 $)",
                    sale_price: "35,000 TSh (~14 $)",
                    image: "https://x.xcute.workers.dev/f/images/7cc39168c22c.jpg"
                },
                {
                    title: "⚡ Function Premium Add‑on",
                    brand: "Bot Add‑on",
                    price: "10,000 TSh (~4 $)",
                    sale_price: "8,000 TSh (~3 $)",
                    image: "https://x.xcute.workers.dev/f/images/0c05495147e0.jpg"
                }
            ];

            // ─── Separate header and rest ──────────────────────────────
            const top  = productList[0];
            const rest = productList.slice(1);

            // ─── Build the full list text ──────────────────────────────
            const listText =
                productList
                    .map((p, i) => {
                        if (i === 0) return "";
                        const priceDisplay = p.sale_price
                            ? `~${p.price}~ ➜ *${p.sale_price}*`
                            : `*${p.price}*`;
                        return `${i}. *${p.title}* (${p.brand})\n   ${priceDisplay}`;
                    })
                    .filter(line => line)
                    .join("\n\n");

            // ─── Send rich store message ───────────────────────────────
            await new AIRich(ctx.core)
                .addText("`Product Catalog BIG•ST4CK` 🛍️")

                // Header product card
                .addProduct({
                    title:      top.title,
                    brand:      top.brand,
                    price:      top.price,
                    sale_price: top.sale_price,
                    url:        waLink,
                    image:      top.image,
                    icon:       top.image
                })

                // HScroll for all other products
                .addProduct(rest.map(p => ({
                    title:      p.title,
                    brand:      p.brand,
                    price:      p.price,
                    sale_price: p.sale_price,
                    url:        waLink,
                    image:      p.image,
                    icon:       p.image
                })))

                // Full product list with prices and trial info
                .addText(
                    `\`Product List\` 📦\n\n` +
                    `${listText}\n\n` +
                    `Interested in one of the products above? Click\n` +
                    `the button below to chat directly with the owner\n` +
                    `and start the ordering process.`
                )

                .addTip("_Regards: © BIG•ST4CK_")

                .addSuggest([
                    `Contact Owner`,
                    `${ctx.used.prefix}owner`,
                    `${ctx.used.prefix}plans`
                ])

                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};