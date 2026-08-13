const axios = require("axios");

module.exports = {
    name: "deluser",
    aliases: [],
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            const usr = ctx.args[0];

            if (!usr) {
                return await ctx.reply(`Format: ${ctx.used.prefix}deluser [user-id]\nExample: ${ctx.used.prefix}deluser 15`);
            }

            const f = await axios.delete(`${global.domain}/api/application/users/${usr}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${global.plta}`
                }
            }).catch(e => e.response);

            if (f.status !== 204 && f.status !== 200) {
                return await ctx.reply(`Id ${usr} not found`);
            }

            await ctx.reply(`Successfully deleted user ID ${usr}!`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};