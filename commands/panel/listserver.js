module.exports = {
    name: "listserver",
    aliases: ["cpanel"],
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            const page = ctx.args[0] || "1";
            const { data: res } = await axios.get(`${global.domain}/api/application/servers?page=${page}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${global.plta}`
                }
            });

            const servers = res.data;
            let messageText = `Following list server:\n\n`;

            for (const server of servers) {
                const s = server.attributes;
                const shortUuid = s.uuid.split("-")[0];
                let status = s.status;
                try {
                    const { data: resData } = await axios.get(`${global.domain}/api/client/servers/${shortUuid}/resources`, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${global.pltc}`
                        }
                    });
                    status = resData.attributes ? resData.attributes.current_state : s.status;
                } catch {}

                messageText += `ID server: ${s.id}\n`;
                messageText += `Name server: ${s.name}\n`;
                messageText += `Status: ${status}\n\n`;
            }

            messageText += `Page: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
            messageText += `Total server: ${res.meta.pagination.count}`;

            await ctx.reply(messageText);

            if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
                await ctx.reply(`Example: ${ctx.used.prefix}listserver ${res.meta.pagination.current_page + 1} to see the next page`);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};