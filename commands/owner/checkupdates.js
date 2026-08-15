const { exec } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const util = require("node:util");
const execPromise = util.promisify(exec);

module.exports = {
    name: "checkupdates",
    aliases: ["update", "pull", "gitpull"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            // ── 1. Send initial message ──
            const statusMsg = await ctx.reply("🔍 *Checking for updates...*");

            // ── 2. Get the repo URL from package.json or config ──
            const repoUrl = config?.system?.repoUrl || "https://github.com/bigtechs2/BIGST4CK.git";
            const branch = config?.system?.repoBranch || "main";
            const repoName = repoUrl.split("/").pop().replace(".git", "");

            // ── 3. Check if git is installed ──
            try {
                await execPromise("git --version");
            } catch (_) {
                return await ctx.reply("❌ Git is not installed on this server. Please install git first.");
            }

            // ── 4. Check current commit hash ──
            let currentHash = "";
            try {
                const { stdout } = await execPromise("git rev-parse HEAD");
                currentHash = stdout.trim();
            } catch (_) {
                // If not a git repo, clone it
                await ctx.editMessage(
                    ctx.id,
                    statusMsg.key,
                    "📦 *Cloning repository...*"
                );
                await execPromise(`git clone ${repoUrl} .`);
                const { stdout } = await execPromise("git rev-parse HEAD");
                currentHash = stdout.trim();
                await ctx.editMessage(
                    ctx.id,
                    statusMsg.key,
                    "✅ *Repository cloned successfully!*"
                );
            }

            // ── 5. Fetch latest changes ──
            await ctx.editMessage(
                ctx.id,
                statusMsg.key,
                "🔄 *Fetching latest changes from GitHub...*"
            );

            await execPromise(`git fetch origin ${branch}`);

            // ── 6. Get remote commit hash ──
            const { stdout: remoteStdout } = await execPromise(`git rev-parse origin/${branch}`);
            const remoteHash = remoteStdout.trim();

            // ── 7. Compare hashes ──
            if (currentHash === remoteHash) {
                return await ctx.editMessage(
                    ctx.id,
                    statusMsg.key,
                    "✅ *No updates found!*\n\n" +
                    `You are already on the latest commit:\n` +
                    `\`${currentHash.substring(0, 7)}\``
                );
            }

            // ── 8. Pull changes ──
            await ctx.editMessage(
                ctx.id,
                statusMsg.key,
                "📥 *Pulling latest changes...*"
            );

            const { stdout: pullStdout } = await execPromise(`git pull origin ${branch}`);
            const changedFiles = pullStdout.split("\n").filter(line => line.includes("|") || line.includes("create") || line.includes("delete"));

            // ── 9. Install dependencies ──
            if (fs.existsSync("package.json")) {
                await ctx.editMessage(
                    ctx.id,
                    statusMsg.key,
                    "📦 *Installing dependencies...*"
                );
                await execPromise("npm install --legacy-peer-deps");
            }

            // ── 10. Send success message ──
            const newHash = (await execPromise("git rev-parse HEAD")).stdout.trim();
            const updatedFiles = changedFiles.length > 0
                ? changedFiles.slice(0, 5).join("\n") + (changedFiles.length > 5 ? `\n... and ${changedFiles.length - 5} more` : "")
                : "No file details available";

            await ctx.editMessage(
                ctx.id,
                statusMsg.key,
                `✅ *Update successful!*\n\n` +
                `📦 Repository: ${repoName}\n` +
                `🔀 Branch: ${branch}\n` +
                `📌 Old commit: \`${currentHash.substring(0, 7)}\`\n` +
                `📌 New commit: \`${newHash.substring(0, 7)}\`\n` +
                `📝 Changed files:\n${updatedFiles}\n\n` +
                `🔄 *Restarting bot...*`
            );

            // ── 11. Restart the bot ──
            // Try PM2 first, fallback to process.exit
            try {
                const pm2Check = await execPromise("pm2 --version");
                if (pm2Check.stdout) {
                    // Using PM2 – restart the current process
                    const scriptName = process.env.pm_id ? `BIGST4CK` : "index.js";
                    await execPromise(`pm2 restart ${scriptName}`);
                    await ctx.reply("🔄 *Bot restarted via PM2!*");
                } else {
                    // No PM2 – exit and let the process manager restart
                    await ctx.reply("🔄 *Bot will restart now...*");
                    setTimeout(() => {
                        process.exit(1);
                    }, 2000);
                }
            } catch (_) {
                // No PM2 – exit
                await ctx.reply("🔄 *Bot will restart now...*");
                setTimeout(() => {
                    process.exit(1);
                }, 2000);
            }

        } catch (error) {
            console.error("[checkupdates] Error:", error);
            await ctx.reply(
                `❌ *Update failed!*\n\n` +
                `Error: ${error.message}\n\n` +
                `Please check the logs and try again manually.`
            );
        }
    }
};