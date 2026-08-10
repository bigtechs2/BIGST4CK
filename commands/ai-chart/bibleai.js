const axios = require("axios");

module.exports = {
    name: "bible",
    aliases: ["alkitab", "bibleai"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input) {
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "What is faith?")
            );
        }

        const senderDb = ctx.db.user;

        // ── Reset session ──
        if (input.toLowerCase() === "reset") {
            if (!senderDb.sessionId) senderDb.sessionId = {};
            senderDb.sessionId.bible = ctx.helper.randomUUID();
            senderDb.save();
            return await ctx.reply(tools.msg.info("Conversation history has been reset!"));
        }

        try {
            // ── Ensure session exists ──
            if (!senderDb.sessionId?.bible) {
                if (!senderDb.sessionId) senderDb.sessionId = {};
                senderDb.sessionId.bible = ctx.helper.randomUUID();
                senderDb.save();
            }

            // ── Build API URL ──
            const apiUrl = tools.api.createUrl("siputzx", "/api/ai/bibleai", {
                text: input,
                session: senderDb.sessionId.bible
            });

            // ── Fetch AI response ──
            const { data } = await axios.get(apiUrl, { timeout: 60000 });

            // ── Extract result ──
            let result = data.data?.results?.answer || data.result || "No response received.";

            // ── Extract sources if available ──
            let sources = "";
            if (data.data?.results?.sources && data.data.results.sources.length > 0) {
                const verseSources = data.data.results.sources
                    .filter(s => s.type === "verse")
                    .map(s => s.splitReference?.refLong || s.text)
                    .filter(Boolean);

                if (verseSources.length > 0) {
                    sources = "\n\n*📖 Bible References:*\n" + verseSources.map(ref => `› ${ref}`).join("\n");
                }

                // ── Add book sources if available ──
                const bookSources = data.data.results.sources
                    .filter(s => s.type === "book" && s.title)
                    .map(s => `› ${s.title} – ${s.author || "Unknown"}`)
                    .slice(0, 3);

                if (bookSources.length > 0) {
                    sources += "\n\n*📚 Further Reading:*\n" + bookSources.join("\n");
                }
            }

            // ── Add translation info ──
            let translationInfo = "";
            if (data.data?.results?.translation) {
                translationInfo = `\n_Translation: ${data.data.results.translation}_`;
            }

            // ── Truncate if too long ──
            if (result.length > 3500) {
                result = result.substring(0, 3500) + "\n\n_... (truncated)_";
            }

            // ── Send with AIRich ──
            await new AIRich(ctx.core)
                .addText(
                    `# 📖 Bible AI\n\n` +
                    `**Q:** ${input}\n\n` +
                    `**A:** ${result}${sources}${translationInfo}\n\n` +
                    `[](https://wa.me/${config.owner.id})`
                )
                .addTip("_Powered by bigmanjtech™ — ai system_")
                .addSuggest([
                    `${ctx.used.prefix}bible`,
                    `${ctx.used.prefix}chatgpt`,
                    `${ctx.used.prefix}menu ai-chat`
                ])
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};