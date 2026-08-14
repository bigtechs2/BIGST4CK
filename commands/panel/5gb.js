// 5gb.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "5gb",
    category: "owner",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "5150", cpu: "100", disk: "5150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};