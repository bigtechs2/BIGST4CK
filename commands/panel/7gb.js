// 7gb.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "7gb",
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "7150", cpu: "140", disk: "7150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};