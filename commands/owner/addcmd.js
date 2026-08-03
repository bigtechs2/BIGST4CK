const fs   = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "addcmd",
    aliases: ["editcmd", "savecmd"],
    category: "owner",
    permissions: { owner: true },

    code: async (ctx) => {
        try {
            const fileName = ctx.args[0];
            const code     = ctx.quoted?.body || ctx.text?.replace(fileName || "", "").trim();

            if (!code || code.trim().length < 10)
                return await ctx.reply(tools.msg.info(
                    `How to use:\n` +
                    `— Reply code with \`${ctx.used.prefix}addcmd namefile\`\n` +
                    `— Or: \`${ctx.used.prefix}addcmd namefile [code]\``
                ));

            const categoryMatch = code.match(/category\s*:\s*["']([^"']+)["']/);
            if (!categoryMatch)
                return await ctx.reply(tools.msg.info("No `category` found in code."));

            const cmdCat = categoryMatch[1].trim();

            let cmdName = fileName;
            if (!cmdName) {
                const nameMatch = code.match(/name\s*:\s*["']([^"']+)["']/);
                if (!nameMatch)
                    return await ctx.reply(tools.msg.info("No `name` found in the code and no filename argument."));
                cmdName = nameMatch[1].trim();
            }

            const cmdDir   = path.resolve(__dirname, "../../commands", cmdCat);
            const filePath = path.join(cmdDir, `${cmdName}.js`);

            if (!fs.existsSync(cmdDir)) fs.mkdirSync(cmdDir, { recursive: true });

            const isNew = !fs.existsSync(filePath);
            fs.writeFileSync(filePath, code, "utf-8");

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // LOAD THE COMMAND AND REMOVE DUPLICATES
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            try {
                // 1. Clear require cache
                delete require.cache[require.resolve(filePath)];

                // 2. Require the new command
                const newCmd = require(filePath);

                if (newCmd && newCmd.name) {
                    // 3. Remove ALL existing entries with same name or aliases
                    const keysToDelete = [];
                    for (const [key, val] of ctx.bot.cmd) {
                        if (val.name === newCmd.name) {
                            keysToDelete.push(key);
                        }
                    }
                    keysToDelete.forEach(key => ctx.bot.cmd.delete(key));

                    // 4. Add the new command
                    ctx.bot.cmd.set(newCmd.name, newCmd);
                    if (newCmd.aliases) {
                        newCmd.aliases.forEach(alias => ctx.bot.cmd.set(alias, newCmd));
                    }
                    console.log(`[addcmd] ✅ Loaded command: ${newCmd.name}`);
                } else {
                    console.warn(`[addcmd] ⚠️ File loaded but no 'name' property.`);
                }
            } catch (loadError) {
                console.error(`[addcmd] ❌ Failed to load command:`, loadError);
                await ctx.reply(`⚠️ Command file created but failed to load: ${loadError.message}`);
            }

            await ctx.reply(
                `› ${formatter.bold(isNew ? "Command added!" : "Command updated!")}\n\n` +
                `Name: ${formatter.inlineCode(cmdName)}\n` +
                `Category: ${formatter.inlineCode(cmdCat)}\n` +
                `Path: ${formatter.inlineCode(`commands/${cmdCat}/${cmdName}.js`)}\n\n` +
                `Command is now active`
            );

        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
}