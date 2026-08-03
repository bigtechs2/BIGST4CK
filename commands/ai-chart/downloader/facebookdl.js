module.exports = {
    name: "facebookdl",
    aliases: ["facebook", "fb", "fbdl"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || ctx.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                ctx.format.generateCmdExample(ctx.used, "https://www.facebook.com/reel/2796711250580249")
            );

        if (!ctx.helper.isUrl(url)) return await ctx.reply(ctx.format.info(config.msg.invalidUrl));

        try {
            const apiUrl = ctx.api.createUrl("nexray", "/downloader/facebook", {
                url
            });
            const result = (await ctx.request.get(apiUrl)).data.result;

            const videoUrl = result.video_hd || result.video_sd || result.video;
            const description = result.description || result.caption || result.title || "Facebook Video";
            const link = result.url || url;

            // ── Send AIRich card with video + description + link ──
            await new AIRich(ctx.core)
                .addVideo(videoUrl)
                .addText(
                    `📝 **Description:**\n${description}\n\n` +
                    `🔗 **Link:** ${link}`
                )
                .addTip("_Tap the video to play_")
                .setFooter(config.msg.footer || "© BIGST4CK")
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};