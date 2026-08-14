const util = require("node:util");

module.exports = {
    name: "run",
    aliases: ["eval", "exec", ">"],
    category: "owner",
    permissions: { owner: true },

    code: async (ctx) => {
        try {
            if (!ctx.sender.isOwner()) return;

            const quoted = ctx.quoted;
            let raw = "";

            if (quoted) {
                raw = quoted.text || quoted.body || quoted.caption || "";
            } else {
                raw = ctx.args.join(" ");
            }

            raw = raw.trim();

            if (!raw) {
                return await ctx.reply("Reply To the Code of js!");
            }

            let code;
            if (raw.startsWith("=>")) {
                code = "return " + raw.slice(2).trimStart();
            } else if (raw.startsWith(">")) {
                code = raw.slice(1).trimStart();
            } else {
                code = raw;
            }

            let result;
            let logs = [];

            try {
                const sandboxModule = { exports: {} };

                // print/console.log inakusanya output kwenye "logs"
                // badala ya kutuma reply mara moja moja (anti-spam)
                const print = (...args) => {
                    logs.push(args.map(a =>
                        typeof a === "string" ? a : util.inspect(a, { depth: 2 })
                    ).join(" "));
                };

                const fakeConsole = {
                    log: print,
                    error: print,
                    warn: print,
                    info: print
                };

                const exec = new (Object.getPrototypeOf(async function () {}).constructor)(
                    "ctx", "require", "tools", "config", "formatter",
                    "module", "exports", "print", "console",
                    code
                );

                result = await exec(
                    ctx, require, tools, config, formatter,
                    sandboxModule, sandboxModule.exports, print, fakeConsole
                );

                // kama code ni "module.exports = {...}" tu (tanpa return)
                if (result === undefined && Object.keys(sandboxModule.exports).length) {
                    result = sandboxModule.exports;
                }

            } catch (err) {
                result = err;
            }

            const resultText =
                typeof result === "string"
                    ? result
                    : util.inspect(result, { depth: 2 });

            const finalOutput = logs.length
                ? `${logs.join("\n")}\n\n--- return ---\n${resultText}`
                : resultText;

            await ctx.reply(
                formatter.monospace(
                    finalOutput.length > 4000
                        ? finalOutput.slice(0, 4000) + "\n...(truncated)"
                        : finalOutput
                )
            );

        } catch (error) {
            await tools.cmd.handleError(ctx, error, false, true);
        }
    }
};