const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports = {
name: "backupscript",
aliases: ["backupsc"],
category: "owner",
permissions: {
owner: true
},

code: async (ctx) => {
    try {
        const target = (ctx.args[0] || "bot").toLowerCase();

        let targetJid;

        switch (target) {
            case "owner":
                targetJid = config.owner.id + "@s.whatsapp.net";
                break;

            case "co":
                if (!config.owner.co?.[0]?.id) {
                    return await ctx.reply(
                        tools.msg.info("Second owner not found.")
                    );
                }

                targetJid = config.owner.co[0].id + "@s.whatsapp.net";
                break;

            case "bot":
            default:
                targetJid =
                    ctx._client.user.id.split(":")[0] +
                    "@s.whatsapp.net";
        }

        await ctx.reply(
            `ⓘ Currently creating a script backup...

Target: ${target}`
);

        const date = new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/:/g, "-");

        const zipName = `backup_${date}.zip`;

        const command = [
            `zip -r "${zipName}" .`,
            `-x "node_modules/*"`,
            `-x "state/*"`,
            `-x "node/*"`,
            `-x ".bashrc/*"`,
            `-x ".config*/"`,
            `-x ".git/*"`,
            `-x ".npm/*"`,
            `-x "tmp/*"`,
            `-x "temp/*"`,
            `-x ".cache/*"`,
            `-x "logs/*"`,
            `-x "package-lock.json"`,
            `-x "yarn.lock"`,
            `-x "pnpm-lock.yaml"`,
            `-x "backup*.zip"`
        ].join(" ");

        await new Promise((resolve, reject) => {
            exec(
                command,
                {
                    cwd: process.cwd(),
                    maxBuffer: 1024 * 1024 * 50
                },
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        const zipPath = path.join(process.cwd(), zipName);

        if (!fs.existsSync(zipPath)) {
            throw new Error("Backup file not found.");
        }

        const stats = fs.statSync(zipPath);

        await ctx._client.sendMessage(
            targetJid,
            {
                document: fs.readFileSync(zipPath),
                mimetype: "application/zip",
                fileName: zipName,
                caption:
                    `Backup Script\n\n` +
                    `Target: ${target}\n` +
                    `Date: ${new Date().toLocaleString("id-ID")}\n` +
                    `Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`
            }
        );

        fs.unlinkSync(zipPath);

        await ctx.reply(
            `ⓘ Backup successfully sent to ${target}.`
        );

    } catch (error) {
        console.error(error);

        await ctx.reply(
            tools.msg.info(
                error?.message ||
                "Failed to create backup."
            )
        );
    }
}

};