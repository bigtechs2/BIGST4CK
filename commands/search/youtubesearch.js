module.exports = {
    name: "youtubesearch",
    aliases: ["youtube", "youtubes", "yt", "yts", "ytsearch"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                ctx.format.generateCmdExample(ctx.used, "one last kiss - hikaru utada")
            );

        if (ctx.helper.isUrl(input))
            return await ctx.reply({
                text: ctx.format.info("Input is a URL, use the download buttons below:"),
                buttons: [{
                    text: "Download Audio",
                    id: `${ctx.used.prefix}youtubeaudio ${input}`
                }, {
                    text: "Download Video",
                    id: `${ctx.used.prefix}youtubevideo ${input}`
                }]
            });

        try {
            const apiUrl = ctx.api.createUrl("alwayscodex", "/api/search/youtube-search", {
                query: input
            });
            const result = (await ctx.request.get(apiUrl)).data.result.videos;

            const resultText = result.map(res =>
                `»› ${ctx.format.bold("Title")}: ${res.title}\n` +
                `»› ${ctx.format.bold("Channel")}: ${res.channel}\n` +
                `»› ${ctx.format.bold("Duration")}: ${res.duration}\n` +
                `»› ${ctx.format.bold("URL")}: ${res.url}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || ctx.format.info(config.msg.notFound));
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};