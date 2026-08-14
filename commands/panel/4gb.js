// 4gb.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "4gb",
    aliases: ["cpanel"],
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "4150", cpu: "80", disk: "4150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};