const axios = require("axios");

module.exports = {
    name: "bibleai",
    aliases: ["bible", "scripture", "word"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input) {
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "What is faith?") + "\n" +
                tools.msg.generateNotes([
                    "Ask any Bible question and get answers with scripture references.",
                    "Type `.bibleai reset` to clear conversation history."
                ])
            );
        }

        const senderDb = ctx.db.user;

        // ── Reset session ──
        if (input.toLowerCase() === "reset") {
            if (!senderDb.sessionId) senderDb.sessionId = {};
            senderDb.sessionId.bibleai = ctx.helper.randomUUID();
            senderDb.save();
            return await ctx.reply(tools.msg.info("Conversation history has been reset!"));
        }

        try {
            // ── Ensure session exists ──
            if (!senderDb.sessionId?.bibleai) {
                if (!senderDb.sessionId) senderDb.sessionId = {};
                senderDb.sessionId.bibleai = ctx.helper.randomUUID();
                senderDb.save();
            }

            // ── Build API URL ──
            const apiUrl = tools.api.createUrl("siputzx", "/ai/bibleai", {
                text: input,
                session: senderDb.sessionId.bibleai
            });

            // ── Fetch AI response ──
            const { data } = await axios.get(apiUrl, { timeout: 60000 });

            // ── Extract result ──
            let result = data?.data?.results?.answer || data?.data?.results || data?.result || "No response received.";

            // ── Extract sources / references ──
            let sources = [];
            let sourceText = "";

            if (data?.data?.results?.sources) {
                sources = data.data.results.sources;
                // Filter only verse references
                const verseSources = sources.filter(s => s.type === "verse");
                if (verseSources.length > 0) {
                    sourceText = "\n\n*📖 Scripture References:*\n";
                    verseSources.forEach((s, i) => {
                        const ref = s.splitReference?.refLong || s.bcv?.referenceLong || s.text || "Unknown";
                        sourceText += `  ${i + 1}. ${ref}\n`;
                    });
                }

                // Add book sources if available
                const bookSources = sources.filter(s => s.type === "book");
                if (bookSources.length > 0) {
                    sourceText += "\n*📚 Additional Resources:*\n";
                    bookSources.forEach((s, i) => {
                        const title = s.title || "Resource";
                        const author = s.author ? ` by ${s.author}` : "";
                        sourceText += `  ${i + 1}. ${title}${author}\n`;
                    });
                }

                // Add article sources
                const articleSources = sources.filter(s => s.type === "article");
                if (articleSources.length > 0) {
                    sourceText += "\n*📝 Articles:*\n";
                    articleSources.forEach((s, i) => {
                        const title = s.title || "Article";
                        sourceText += `  ${i + 1}. ${title}\n`;
                    });
                }
            }

            // ── Extract translation info ──
            const translation = data?.data?.translation || "ESV";
            const translationCode = data?.data?.translationCode || "ESV";

            // ── Truncate if too long ──
            if (result.length > 3000) {
                result = result.substring(0, 3000) + "\n\n_... (truncated)_";
            }

            // ── Send with AIRich ──
            const bodyText =
                `**Q:** ${input}\n\n` +
                `**A:** ${result}` +
                `${sourceText}\n\n` +
                `📖 *Translation:* ${translation} (${translationCode})` +
                `\n\n[](https://wa.me/${config.owner.id})`;

            await new AIRich(ctx.core)
                .addText(
                    `# 📖 Bible AI\n\n` +
                    `${bodyText}`
                )
                .addTip("_Powered by Siputzx — Bible AI with Scripture References_")
                .addSuggest([
                    `${ctx.used.prefix}bibleai`,
                    `${ctx.used.prefix}chatgpt`,
                    `${ctx.used.prefix}menu ai-chat`
                ])
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            console.error("[bibleai] Error:", error);
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};