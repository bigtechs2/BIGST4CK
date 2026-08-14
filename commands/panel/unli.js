// unli.js
const createPanel = require("../../lib/createPanel.js");
module.exports = {
    name: "unli",
    aliases: ["unlimited"],
    category: "panel",
    permissions: { premium: true },
    code: async (ctx) => {
        try {
            await createPanel(ctx, { memo: "0", cpu: "0", disk: "0" });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};