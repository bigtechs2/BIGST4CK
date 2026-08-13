const axios = require("axios");

module.exports = {
    name: "delserver",
    aliases: [],
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            const srv = ctx.args[0];

            if (!srv) {
                return await ctx.reply(`Format: ${ctx.used.prefix}delserver [server-id]\nExample: ${ctx.used.prefix}delserver 15`);
            }

            const f = await axios.delete(`${global.domain}/api/application/servers/${srv}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${global.plta}`
                }
            }).catch(e => e.response);

            if (f.status !== 204 && f.status !== 200) {
                return await ctx.reply(`Id ${srv} not found!`);
            }

            await ctx.reply(`Successfully deleted server ID ${srv}!`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};