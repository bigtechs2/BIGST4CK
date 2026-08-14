const util = require("node:util");

module.exports = {
    name: "collector",
    aliases: ["collect"],
    category: "misc",
    code: async (ctx) => {
        const timeout = parseInt(ctx.args[0], 10) || 60000;
        if (isNaN(timeout)) return await ctx.reply(ctx.format.info("The timeout time must be a number!"));

        try {
            const collector = ctx.MessageCollector({
                time: timeout,
                filter: (collCtx) => !collCtx.msg.key.fromMe
            });
            await ctx.reply(ctx.format.info(`Collector starts with timeout ${ctx.format.convertMsToDuration(timeout)}.`));

            collector.on("collect", async (collCtx) =>
                await collCtx.reply(ctx.format.monospace(util.inspect(collCtx.bot.m, {
                    depth: null,
                    maxArrayLength: null,
                    maxStringLength: null,
                    showHidden: true
                }))));

            collector.on("end", async () => await ctx.reply(ctx.format.info("Collector berhenti!")));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};