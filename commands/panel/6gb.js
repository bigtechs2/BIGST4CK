// 6gb.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "6gb",
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "6150", cpu: "120", disk: "6150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};