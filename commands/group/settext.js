module.exports = {
    name: "settext",
    aliases: ["settxt"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const key = ctx.args[0];
        const text = ctx.text.startsWith(`${key} `) ? ctx.text.slice(key.length + 1) : ctx.quoted?.body;

        if (key?.toLowerCase() === "list") {
            const listText = await ctx.list.get(ctx, "settext");
            return await ctx.reply(listText);
        }

        if (!key || !text)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "welcome Welcome to the group!")}\n` +
                ctx.format.generateNotes([
                    `Type ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} to see the list.`,
                    `Use ${ctx.format.inlineCode("delete")} as the text to delete the previously saved text.`
                ])
            );

        try {
            let setKey;

            switch (key.toLowerCase()) {
                case "goodbye":
                case "intro":
                case "welcome":
                    setKey = key.toLowerCase();
                    break;
                default:
                    return await ctx.reply(ctx.format.info(`Text ${ctx.format.inlineCode(key)} is invalid!`));
            }

            const groupDb = ctx.db.group;

            if (text.toLowerCase() === "delete") {
                delete groupDb?.text?.[setKey];
                groupDb.save();
                return await ctx.reply(ctx.format.info(`Message for text ${ctx.format.inlineCode(key)} has been deleted!`));
            }

            (groupDb.text ||= {})[setKey] = text;
            groupDb.save();
            await ctx.reply(ctx.format.info(`Message for text ${ctx.format.inlineCode(key)} has been saved!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};