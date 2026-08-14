const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "9gb",
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "9150", cpu: "180", disk: "9150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};