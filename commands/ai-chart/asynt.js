module.exports = {
    name: "asynt",
    aliases: ["asyntai"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },

    code: async (ctx) => {
        try {
            const input = ctx.text || ctx.quoted?.body;

            if (!input)
                return await ctx.reply(
                    `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "hello, who are you?")}\n` +
                    tools.msg.generateNotes([
                        `Type ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} reset`)} to reset conversation history.`
                    ])
                );

            if (input === "reset") {
                const senderDb = ctx.db.user;
                delete senderDb.asyntSessionId;
                senderDb.save();
                return await ctx.reply(tools.msg.info("Conversation history successfully reset!"));
            }

            const senderDb  = ctx.db.user;
            const sessionId = senderDb.asyntSessionId || ctx.sender.jid.replace(/[^0-9]/g, "");

            const { data } = await axios.get("https://api.synoxcloud.xyz/ai-chat/asynt-ai", {
                params: { text: input, session: sessionId },
                timeout: 30000
            });

            if (!data?.status || !data?.result?.reply)
                throw new Error("Invalid API response.");

            if (!senderDb.asyntSessionId) {
                senderDb.asyntSessionId = sessionId;
                senderDb.save();
            }

            await ctx.reply({ richResponse: [{ text: data.result.reply }] });

        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};