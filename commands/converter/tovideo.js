module.exports = {
    name: "tovideo",
    aliases: ["tomp4", "tovid", "sticker2video"],
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
            const result = (await ctx.request.post("https://nekochii-converter.hf.space/webp2mp4", {
                file: buffer.toString("base64"),
                json: true
            })).data.result;

            // ── Send the video ──
            await ctx.reply({
                video: {
                    url: result
                }
            });

        } catch (error) {
            console.error("[tovideo] Error:", error);
            await ctx.reply("❌ Failed to convert sticker to video. Please try again later.");
        }
    }
};