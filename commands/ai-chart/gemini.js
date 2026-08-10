const axios = require("axios");

module.exports = {
    name: "gemini",
    aliases: ["geminiai", "googleai"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input) {
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "Tell me about black holes")
            );
        }

        const senderDb = ctx.db.user;

        // ── Reset session ──
        if (input.toLowerCase() === "reset") {
            if (!senderDb.sessionId) senderDb.sessionId = {};
            senderDb.sessionId.gemini = ctx.helper.randomUUID();
            senderDb.save();
            return await ctx.reply(tools.msg.info("Conversation history has been reset!"));
        }

        try {
            // ── Ensure session exists ──
            if (!senderDb.sessionId?.gemini) {
                if (!senderDb.sessionId) senderDb.sessionId = {};
                senderDb.sessionId.gemini = ctx.helper.randomUUID();
                senderDb.save();
            }

            // ── Build API URL ──
            const apiUrl = tools.api.createUrl("alwayscodex", "/api/ai/gemini-pro", {
                teks: input,
                session: senderDb.sessionId.gemini
            });

            // ── Fetch AI response ──
            const { data } = await axios.get(apiUrl, { timeout: 30000 });

            // ── Extract result ──
            let result = data.result || "No response received.";

            // ── Truncate if too long ──
            if (result.length > 3500) {
                result = result.substring(0, 3500) + "\n\n_... (truncated)_";
            }

            // ── Send with AIRich ──
            await new AIRich(ctx.core)
                .addText(
                    `# 🧠 Gemini AI\n\n` +
                    `**Q:** ${input}\n\n` +
                    `**A:** ${result}\n\n` +
                    `[](https://wa.me/${config.owner.id})`
                )
                .addTip("_Powered by bigmanjtech™ — ai system_")
                .addSuggest([
                    `${ctx.used.prefix}gemini`,
                    `${ctx.used.prefix}chatgpt`,
                    `${ctx.used.prefix}menu ai-chat`
                ])
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};