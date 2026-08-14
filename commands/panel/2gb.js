// 2gb.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "2gb",
    aliases: ["cpanel"],
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "2150", cpu: "50", disk: "2150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};