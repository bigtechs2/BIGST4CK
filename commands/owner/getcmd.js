const fs = require("fs");
const path = require("path");

module.exports = {
    name: "getcmd",
    aliases: ["getc", "source"],
    category: "owner",
    permissions: {
        owner: true
    },

    code: async (ctx) => {
        try {
            const query = ctx.args[0]?.toLowerCase();

            if (!query) {
                return await ctx.reply(
                    `Example:\n${ctx.used.prefix}getcmd menu`
                );
            }

            let targetFile = null;

            const scanDir = (dir) => {
                const files = fs.readdirSync(dir);

                for (const file of files) {
                    const fullPath = path.join(dir, file);
                    const stat = fs.statSync(fullPath);

                    if (stat.isDirectory()) {
                        scanDir(fullPath);
                        continue;
                    }

                    if (
                        file.toLowerCase() === `${query}.js`
                    ) {
                        targetFile = fullPath;
                        return;
                    }
                }
            };

            scanDir(
                path.join(process.cwd(), "commands")
            );

            if (!targetFile) {
                return await ctx.reply(
                    tools.msg.info(
                        `Command "${query}" not found.`
                    )
                );
            }

            const source = fs.readFileSync(
                targetFile,
                "utf8"
            );

            const maxLength = 50000;

            await new AIRich(ctx.core)
                .setTitle(
                    `📄 ${path.basename(targetFile)}`
                )
                .addCode(
                    "javascript",
                    source.length > maxLength
                        ? source.slice(0, maxLength) +
                          "\n\n// Output was truncated because it was too long..."
                        : source
                )
                .send(
                    ctx._msg.key.remoteJid
                );

        } catch (error) {
            await tools.cmd.handleError(
                ctx,
                error
            );
        }
    }
};