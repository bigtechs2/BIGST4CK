// commands/osettext.js
module.exports = {
    name: "osettext",
    aliases: ["osettxt"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const key = ctx.args[0];
        const text = ctx.text.startsWith(`${key} `) ? ctx.text.slice(key.length + 1) : ctx.quoted?.body;

        if (key?.toLowerCase() === "list") {
            const listText = await ctx.list.get(ctx, "osettext");
            return await ctx.reply(listText);
        }

        if (!key || !text)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "price $1 for 1 month bot rental")}\n` +
                ctx.format.generateNotes([
                    `Type ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} to see the list.`,
                    `Use ${ctx.format.inlineCode("delete")} as the text to delete the previously saved text.`
                ])
            );

        try {
            let setKey;

            switch (key.toLowerCase()) {
                case "donate":
                case "price":
                case "qris":
                    setKey = key.toLowerCase();
                    break;
                default:
                    return await ctx.reply(ctx.format.info(`Text ${ctx.format.inlineCode(key)} is invalid!`));
            }

            const botDb = ctx.db.bot;

            if (text.toLowerCase() === "delete") {
                delete botDb?.text?.[setKey];
                botDb.save();
                return await ctx.reply(ctx.format.info(`Message for text ${ctx.format.inlineCode(key)} has been deleted!`));
            }

            (botDb.text ||= {})[setKey] = text;
            botDb.save();
            await ctx.reply(ctx.format.info(`Message for text ${ctx.format.inlineCode(key)} has been saved!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};