module.exports = {
    name: "githubsearch",
    aliases: ["searchgit", "ghsearch"],
    category: "search",
    permissions: {
        coin: 3
    },

    code: async (ctx) => {
        try {

            // =========================
            // INPUT VALIDATION
            // =========================
            const query = ctx.args.join(" ");
            if (!query) {
                return await ctx.reply({
                    text: formatter.monospace("Enter the keyword you want to search for!\nExample: .githubsearch WhatsApp bot"),
                    footer: config.msg.footer
                });
            }

            // =========================
            // FETCH DATA
            // =========================
            const { data: res } = await axios.get(
                "https://api.nexray.eu.cc/search/github",
                {
                    params: { q: query },
                    timeout: 30000
                }
            );

            if (!res.status || !res.result?.length) {
                return await ctx.reply({
                    text: formatter.monospace(`No search results were found for "${query}".`),
                    footer: config.msg.footer
                });
            }

            // =========================
            // RESULT FORMAT
            // =========================
            const results = res.result.slice(0, 5);

            const list = results.map((item, i) => {
                const desc = item.repository.description
                    ? `\n    › Description   : ${item.repository.description}`
                    : "";
                const lang = item.repository.language
                    ? `\n    › Language   : ${item.repository.language}`
                    : "";

                return [
                    `${i + 1}. *${item.repository.full_name}*`,
                    `    › File   : ${item.file.name}`,
                    `    › Branch : ${item.repository.default_branch}`,
                    `    › Stars  : ${item.repository.stars}` + desc + lang,
                    `    › Repo   : ${item.repository.url}`,
                    `    › Raw    : ${item.file.raw_url}`
                ].join("\n");
            }).join("\n\n");

            const caption = `*Github Search*\n\n`
                + `› Query   : ${query}\n`
                + `› Total   : ${res.result.length} results\n\n`
                + list;

            // =========================
            // SEND RESULTS
            // =========================
            await ctx.reply({
                text: caption,
                footer: config.msg.footer
            });

        } catch (error) {
            await tools.cmd.handleError(
                ctx,
                error,
                true
            );
        }
    }
};