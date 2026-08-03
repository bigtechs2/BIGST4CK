module.exports = {
    name: "groupstatus",
    aliases: ["gcsw", "swgc", "upgcsw", "upswgc"],
    category: "group",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body || "";

        // ── Check if the message itself is media ──
        const isMedia = ctx.isMedia && ctx.isMedia(["image", "video"]);
        // ── Check if the quoted message is media ──
        const isQuotedMedia = ctx.quoted && ctx.quoted.isMedia && ctx.quoted.isMedia(["image", "video"]);

        // If no text and no media, show usage
        if (!input && !isMedia && !isQuotedMedia) {
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text", "image", "video"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "Hello, world!") + "\n" +
                tools.msg.generateNotes([
                    "You can also send an image/video with a caption."
                ])
            );
        }

        try {
            let content = {};

            // ── If the message itself is media ──
            if (isMedia) {
                const buffer = await ctx.msg.download().catch(() => null);
                if (buffer) {
                    const type = ctx.msg.messageType || "image";
                    content = {
                        [type]: buffer,
                        caption: input || ""
                    };
                }
            }
            // ── If the quoted message is media ──
            else if (isQuotedMedia) {
                const buffer = await ctx.quoted.download().catch(() => null);
                if (buffer) {
                    const type = ctx.quoted.messageType || "image";
                    content = {
                        [type]: buffer,
                        caption: input || ""
                    };
                }
            }
            // ── Otherwise it's plain text ──
            else {
                content = { text: input };
            }

            // ── Send the status message ──
            await ctx.reply({
                ...content,
                groupStatus: true
            });

            // ── Send confirmation message in WhatsApp ──
            await ctx.reply("› *Group status sent successfully!*");

            console.log("[groupstatus] Status sent successfully.");

        } catch (error) {
            console.error("[groupstatus] Error:", error);
            await ctx.reply("❌ Failed to send group status. Please try again.");
        }
    }
};