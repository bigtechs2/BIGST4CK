// 3gb.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "3gb",
    aliases: ["cpanel"],
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "3150", cpu: "60", disk: "3150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};