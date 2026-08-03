module.exports = {
    name: "youtubevideo",
    aliases: ["ytmp4", "ytv", "ytvideo"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const flag = ctx.flag({
            document: {
                type: "boolean",
                short: "d",
                default: false
            },
            resolution: {
                type: "string",
                short: "r",
                default: "360"
            }
        });
        const url = flag.input || ctx.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "https://www.youtube.com/watch?v=0Uhh62MUEic -d -r 720")}\n` +
                ctx.format.generatesFlagInfo({
                    "-d": "Send as document",
                    "-r": "Video resolution (available: 144, 240, 360, 480, 720, 1080, 1440, 2160 | default: 360)"
                })
            );

        if (!ctx.helper.isUrl(url)) return await ctx.reply(ctx.format.info(config.msg.invalidUrl));

        try {
            const apiUrl = ctx.api.createUrl("alwayscodex", "/api/downloader/youtube2", {
                url,
                quality: ["360", "480", "720", "1080", "1440", "2160"].includes(flag.resolution) ? `${flag.resolution}p` : "720p"
            });
            const result = (await ctx.request.get(apiUrl)).data.result;

            const document = flag.document;
            if (document) {
                await ctx.reply({
                    document: {
                        url: result.downloadUrl
                    },
                    fileName: `${result.title}.mp4`,
                    mimetype: "video/mp4",
                    caption: `› ${ctx.format.bold("URL")}: ${url}`
                });
            } else {
                await ctx.reply({
                    video: {
                        url: result.downloadUrl
                    },
                    caption: `› ${ctx.format.bold("URL")}: ${url}`
                });
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};