module.exports = {
    name: "instagramdl",
    aliases: ["ig", "igdl", "instagram"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || ctx.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url) {
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                ctx.format.generateCmdExample(ctx.used, "https://www.instagram.com/p/DVKVfnVjyep")
            );
        }

        if (!ctx.helper.isUrl(url)) {
            return await ctx.reply(ctx.format.info(config.msg.invalidUrl));
        }

        try {
            const apiUrl = ctx.api.createUrl("nexray", "/downloader/instagram", {
                url
            });
            const response = (await ctx.request.get(apiUrl)).data;
            const result = response.result || [];

            // ── Ensure result is an array ──
            const mediaArray = Array.isArray(result) ? result : [result];

            // ── Extract metadata ──
            const description = response.caption || response.description || "Instagram Post";
            const author = response.author || response.username || "Unknown";

            // ── Determine media types ──
            const videoItems = mediaArray.filter(item => item.type === "video" && item.url);
            const imageItems = mediaArray.filter(item => item.type === "image" && item.url);

            // ── Use first image as thumbnail (if available) ──
            const thumbnail = imageItems.length > 0 ? imageItems[0].url : (videoItems.length > 0 ? videoItems[0].url : config.bot.thumbnail);

            const footer = config.msg.footer || "© BIGST4CK";

            // ── Build the AIRich message ──
            const rich = new AIRich(ctx.core);

            // ── Add header text ──
            rich.addText(
                `📸 *Instagram Post*\n\n` +
                `📝 *Caption:*\n${description}\n\n` +
                `👤 *Author:* ${author}\n` +
                `🔗 *Link:* ${url}`
            );

            // ── Add images ──
            if (imageItems.length > 0) {
                imageItems.forEach(img => {
                    rich.addImage(img.url);
                });
            }

            // ── Add videos ──
            if (videoItems.length > 0) {
                videoItems.forEach(vid => {
                    rich.addVideo(vid.url);
                });
                rich.addTip("_Tap the video to play_");
            }

            // ── If no media found ──
            if (imageItems.length === 0 && videoItems.length === 0) {
                return await ctx.reply("❌ No media found in this Instagram post.");
            }

            // ── Add footer and send ──
            rich.setFooter(footer)
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            console.error("[instagramdl] Error:", error);
            await ctx.reply("❌ Failed to download Instagram content. Please try again later.");
        }
    }
};