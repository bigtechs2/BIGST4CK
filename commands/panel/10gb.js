// 10gb.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "10gb",
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "10150", cpu: "200", disk: "10150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};