module.exports = {
    name: "listuser",
    aliases: ["cpanel"],
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            const page = ctx.args[0] || "1";
            const { data: res } = await axios.get(`${global.domain}/api/application/users?page=${page}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${global.plta}`
                }
            });

            const users = res.data;
            let messageText = `Followngs list user\n\n`;
            for (const user of users) {
                const u = user.attributes;
                messageText += `ID: ${u.id} - Status: ${u.relationships?.servers ? "Active" : "Not active"}\n`;
                messageText += `${u.username}\n`;
                messageText += `${u.first_name} ${u.last_name}\n\n`;
            }
            messageText += `Halaman: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
            messageText += `Total user: ${res.meta.pagination.count}`;

            await ctx.reply(messageText);

            if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
                await ctx.reply(`Example: ${ctx.used.prefix}listuser ${res.meta.pagination.current_page + 1} to see the next page`);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};