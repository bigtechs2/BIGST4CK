module.exports = {
    name: "chatgpt",
    aliases: ["ai", "gpt"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "what is evangelion?")
            );

        try {
            // =========================
            // FETCH AI RESPONSE
            // =========================
            const { data: res } = await axios.get(
                "https://api.yupra.my.id/api/ai/copilot?text=",
                {
                    params: {
                        prompt: input,
                        model: "think-deeper"
                    },
                    timeout: 60000
                }
            );

            if (!res.success || !res.result?.text) {
                return await ctx.reply(tools.msg.info("Failed to get a response from AI. Please try again later."));
            }

            // =========================
            // SEND RESULT
            // =========================
            await ctx.reply({
                richResponse: [{
                    text: res.result.text
                }]
            });

        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};