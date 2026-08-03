// 1gb.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "1gb",
    aliases: ["cpanel"],
    category: "panel",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "1150", cpu: "30", disk: "1150" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};