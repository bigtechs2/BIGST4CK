module.exports = {
    name: "togif",
    aliases: ["sticker2gif", "towebp"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        // ── Check if the message is a sticker (quoted or sent) ──
        if (!ctx.isMedia(["sticker"], ["quoted"])) {
            return await ctx.reply(
                `${ctx.format.generateInstruction(["reply"], ["sticker"])}`
            );
        }

        try {
            // ── Download the sticker ──
            const buffer = await ctx.quoted.download();

            // ── Send to converter API ──
            const result = (await ctx.request.post("https://nekochii-converter.hf.space/webp2gif", {
                file: buffer.toString("base64"),
                json: true
            })).data.result;

            // ── Send the GIF ──
            await ctx.reply({
                video: {
                    url: result
                },
                gifPlayback: true
            });

        } catch (error) {
            console.error("[togif] Error:", error);
            await ctx.reply("Failed to convert sticker to GIF. Please try again later.");
        }
    }
};