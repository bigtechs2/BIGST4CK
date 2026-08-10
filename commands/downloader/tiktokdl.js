module.exports = {
    name: "tiktokdl",
    aliases: ["tiktok", "tt", "ttdl", "vt", "vtdl"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || ctx.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url) {
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                ctx.format.generateCmdExample(ctx.used, "https://www.tiktok.com/@netflixanime/video/7596931111805078805")
            );
        }

        if (!ctx.helper.isUrl(url)) {
            return await ctx.reply(ctx.format.info(config.msg.invalidUrl));
        }

        try {
            const apiUrl = ctx.api.createUrl("nexray", "/downloader/tiktok", {
                url
            });
            const response = (await ctx.request.get(apiUrl)).data;
            const result = response.result?.data || response.result;

            // ── Determine if it's a video or image(s) ──
            const isVideo = typeof result === "string" && (result.endsWith(".mp4") || result.includes("video"));
            const isImageArray = Array.isArray(result) && result.every(item => typeof item === "string" && (item.endsWith(".jpg") || item.endsWith(".png")));

            // ── Extract metadata ──
            const description = response.result?.desc || response.desc || "TikTok Video";
            const author = response.result?.author || response.author || "Unknown";

            // ── Build the AIRich card ──
            const footer = config.msg.footer || "© BIGST4CK";
            const thumbnail = response.result?.cover || config.bot.thumbnail;

            if (isVideo) {
                // ── Single video ──
                await new AIRich(ctx.core)
                    .addImage(thumbnail)
                    .addVideo(result)
                    .addText(
                        `📝 *Description:*\n${description}\n\n` +
                        `👤 *Author:* ${author}\n` +
                        `🔗 *Link:* ${url}`
                    )
                    .addTip("_Tap the video to play_")
                    .setFooter(footer)
                    .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });
            } else if (isImageArray) {
                // ── Multiple images (carousel) ──
                const rich = new AIRich(ctx.core)
                    .addText(
                        `📸 *Photo Carousel*\n\n` +
                        `📝 *Description:*\n${description}\n\n` +
                        `👤 *Author:* ${author}\n` +
                        `🔗 *Link:* ${url}`
                    )
                    .addTip("_Swipe to view all photos_")
                    .setFooter(footer);

                // Add each image
                result.forEach(imgUrl => {
                    rich.addImage(imgUrl);
                });

                await rich.send(ctx._msg.key.remoteJid, { quoted: ctx._msg });
            } else {
                // ── Fallback: send as plain text/media ──
                await ctx.reply({
                    video: {
                        url: result
                    },
                    caption: `❖ ${ctx.format.bold("URL")}: ${url}`
                });
            }

        } catch (error) {
            console.error("[tiktokdl] Error:", error);
            await ctx.reply("❌ Failed to download TikTok content. Please try again later.");
        }
    }
};