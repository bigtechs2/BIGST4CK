const axios = require("axios");

module.exports = {
    name: "meta",
    aliases: ["metaai", "meta", "askmeta"],
    category: "ai-chat",

    permissions: {
        coin: 1
    },

    code: async (ctx) => {
        try {
            const input = ctx.args.join(" ") || ctx?.quoted?.content || null;

            if (!input) {
                return await ctx.reply(
                    `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    tools.msg.generateCmdExample(ctx.used, "What is artificial intelligence?")
                );
            }

            // ── Send thinking message ──
            const thinkingMsg = await ctx.reply("🧠 *Meta AI is thinking...*");

            // ── Call API ──
            const encodedPrompt = encodeURIComponent(input);
            const apiUrl = `https://api.yupra.my.id/api/ai/copilot?text=${encodedPrompt}`;

            const response = await axios.get(apiUrl, {
                timeout: 30000,
                headers: { "Accept": "application/json" }
            });

            const data = response.data;

            if (!data || data.status !== true) {
                throw new Error(data?.message || "API returned an error.");
            }

            let result = data.result || "No response received from Meta AI.";

            // ── Truncate if too long ──
            if (result.length > 3000) {
                result = result.substring(0, 3000) + "\n\n_... (truncated)_";
            }

            // ── Delete thinking message ──
            if (thinkingMsg && thinkingMsg.delete) {
                await thinkingMsg.delete().catch(() => {});
            }

            // ── Build the response with AIRich (UnlimitedAI style) ──
            await new AIRich(ctx.core)
                .addText(
                    `# 🧠 Meta AI\n\n` +
                    `**Q:** ${input}\n\n` +
                    `**A:** ${result}\n\n` +
                    `[](https://wa.me/${config.owner.id})`
                )
                .addTip("_Powered by Meta AI — Intelligent responses at your fingertips._")
                .addSuggest([
                    `${ctx.used.prefix}meta`,
                    `${ctx.used.prefix}ping`,
                    `${ctx.used.prefix}menu ai-chart`
                ])
                .send(ctx._msg.key.remoteJid, { quoted: ctx._msg });

        } catch (error) {
            console.error("[meta] Error:", error);

            let errorMsg = "❌ *Failed to get response from Meta AI.*\n\n";

            if (error.response) {
                if (error.response.status === 429) {
                    errorMsg += "Too many requests. Please wait a moment and try again.";
                } else if (error.response.status === 400) {
                    errorMsg += "Invalid request. Please check your question and try again.";
                } else if (error.response.status === 404) {
                    errorMsg += "API endpoint not found. The service may be temporarily unavailable.";
                } else if (error.response.status === 500) {
                    errorMsg += "Server error. The AI service is experiencing issues. Please try again later.";
                } else {
                    errorMsg += `Server returned status ${error.response.status}. Please try again later.`;
                }
                if (error.response.data?.message) {
                    errorMsg += `\n\n*Details:* ${error.response.data.message}`;
                }
            } else if (error.code === "ECONNABORTED") {
                errorMsg += "Request timed out. The AI is taking too long. Please try again with a shorter question.";
            } else if (error.request) {
                errorMsg += "No response from the AI server. It may be down. Please try again later.";
            } else {
                errorMsg += error.message || "Unknown error. Please try again later.";
            }

            await ctx.reply(errorMsg);
        }
    }
};