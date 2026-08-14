module.exports = {
    name: "reset",
    category: "profile",
    permissions: {
        private: true
    },
    code: async (ctx) => {
        const input = ctx.args[0];

        try {
            if (input === "y") {
                const usersDb = ctx.db.users;
                usersDb.reset(user => user.jid === ctx.sender.lid);
                return await ctx.reply(ctx.format.info("Your database has been successfully reset!"));
            } else if (input === "n") {
                return await ctx.reply(ctx.format.info("Database reset process has been cancelled."));
            }

            await ctx.reply({
                text: ctx.format.info("Are you sure you want to reset your database? This action will delete all saved data and cannot be undone."),
                buttons: [{
                    text: "Yes",
                    id: `${ctx.used.prefix + ctx.used.command} yes`
                }, {
                    text: "No",
                    id: `${ctx.used.prefix + ctx.used.command} no`
                }]
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};