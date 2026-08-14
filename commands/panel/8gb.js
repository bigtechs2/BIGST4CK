// 8gb.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "8gb",
    aliases: ["cpanel"],
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "8150", cpu: "80", disk: "8150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};