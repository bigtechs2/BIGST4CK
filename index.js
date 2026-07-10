// Import required modules and dependencies
try {
    require("node:process").loadEnvFile();
} catch {}

const fs = require("node:fs");
const path = require("node:path");

// Create automatic Baileys symlink
try {
    const src = path.join(
        process.cwd(),
        "node_modules",
        "@itsreimau",
        "gktw",
        "node_modules",
        "baileys"
    );

    const dest = path.join(
        process.cwd(),
        "node_modules",
        "baileys"
    );

    if (
        fs.existsSync(src) &&
        !fs.existsSync(dest)
    ) {
        fs.symlinkSync(src, dest);
    }
} catch (_) {}

const { Config, Formatter } = require("@itsreimau/gktw");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const pkg = require("./package.json");
const CFonts = require("cfonts");
const http = require("node:http");

// Configure axios retry
axiosRetry(axios, {
    retries: 3,
    retryCondition: (error) => {
        const status = error.response?.status;
        return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            status === 408 ||
            status === 429
        );
    },
    retryDelay: (retryCount) =>
        Math.pow(2, retryCount - 1) * 1000 +
        Math.random() * 500
});

// Set global variables
Object.assign(global, {
    axios,
    config: new Config(
        path.resolve(__dirname, "config.json")
    ),
    formatter: Formatter,
    tools: require("./tools/exports.js")
});

// ── Global Message DB (for crm -snip) ──
global.messageDB = new Map();

global.saveMessage = (msg) => {
    try {
        const id = msg?.key?.id;
        if (!id) return;
        messageDB.set(id, msg);
        // Keep only the last 500 messages
        if (messageDB.size > 500) {
            const firstKey = messageDB.keys().next().value;
            messageDB.delete(firstKey);
        }
    } catch (e) {
        console.error("saveMessage FAIL:", e);
    }
};

global.getMessage = (id) => {
    return messageDB.get(id) || null;
};

// Logger
global.log = {
    print(type, color, ...msg) {
        const time = new Date().toLocaleTimeString("id-ID");
        console.log(
            `\x1b[90m${time}\x1b[0m`,
            `\x1b[${color}m ${type} \x1b[0m`,
            ...msg
        );
    },
    info(...msg)    { this.print("INFO",    "44", ...msg); },
    success(...msg) { this.print("SUCCESS", "42", ...msg); },
    warn(...msg)    { this.print("WARN",    "43", ...msg); },
    error(...msg)   { this.print("ERROR",   "41", ...msg); },
    cmd(...msg)     { this.print("CMD",     "45", ...msg); }
};

log.info("Starting...");

// Display project name
CFonts.say(pkg.name, {
    colors: ["#00A1E0", "#00FFFF"],
    align: "center"
});

CFonts.say(
    `${pkg.description} - By ${pkg.author}`,
    {
        font: "console",
        colors: ["#E0F7FF"],
        align: "center"
    }
);

// Run server if enabled
if (config.system?.useServer) {
    const port = config.system.port;
    http.createServer((_, res) => {
        res.end(`${pkg.name} is running on port ${port}`);
    }).listen(port, () => {
        log.success(`${pkg.name} runs on port ${port}`);
    });
}

// Load MessageBuilder (async because ESM)
import(
    `file://${path.join(process.cwd(), "tools", "MessageBuilder.js")}`
)
.then(({ Button, ButtonV2, Carousel, AIRich }) => {
    Object.assign(global, { Button, ButtonV2, Carousel, AIRich });
    log.success("[MessageBuilder] Loaded!");
})
.catch((e) => {
    log.error("[MessageBuilder] Failed:", e.message);
});

require("./main.js");