module.exports = {
    name: "toaudio",
    aliases: ["toaud", "tomp3"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        // ── Check if the message contains a video ──
        if (!ctx.isMedia(["video"])) {
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send", "reply"], ["video"])}`
            );
        }

        try {
            // ── Download the video ──
            const buffer = await ctx.msg.download() || await ctx.quoted.download();

            // ── Send to converter API ──
            const result = (await ctx.request.post("https://nekochii-converter.hf.space/mp4tomp3", {
                file: buffer.toString("base64"),
                json: true
            })).data.result;

            // ── Send the audio ──
            await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: "audio/mpeg"
            });

        } catch (error) {
            console.error("[toaudio] Error:", error);
            await ctx.reply(" Failed to convert video to audio. Please try again later.");
        }
    }
};