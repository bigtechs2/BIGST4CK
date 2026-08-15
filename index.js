// ── Load environment variables ──
try {
    require("node:process").loadEnvFile();
} catch {}

const fs = require("node:fs");
const path = require("node:path");
const util = require("node:util");
const http = require("node:http");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const CFonts = require("cfonts");
const pkg = require("./package.json");

// ── Configure axios retry ──
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
        Math.pow(2, retryCount - 1) * 1000 + Math.random() * 500
});

// ── Load config.json manually ──
const configPath = path.resolve(__dirname, "config.json");
let config = {};
try {
    const configData = fs.readFileSync(configPath, "utf8");
    config = JSON.parse(configData);
} catch (e) {
    console.error(util.styleText("red", "[x]"), "Failed to load config.json:", e.message);
    process.exit(1);
}

// ── Set up global variables ──
Object.assign(global, {
    axios,
    config,
    tools: {}, // will be filled later if tools/exports.js exists
});

// ── Logger ──
global.log = {
    print(type, color, ...msg) {
        const time = new Date().toLocaleTimeString("id-ID");
        console.log(`\x1b[90m${time}\x1b[0m`, `\x1b[${color}m ${type} \x1b[0m`, ...msg);
    },
    info(...msg)    { this.print("INFO",    "44", ...msg); },
    success(...msg) { this.print("SUCCESS", "42", ...msg); },
    warn(...msg)    { this.print("WARN",    "43", ...msg); },
    error(...msg)   { this.print("ERROR",   "41", ...msg); },
    cmd(...msg)     { this.print("CMD",     "45", ...msg); }
};

log.info("Starting...");

// ── Display banner ──
CFonts.say(pkg.name, {
    colors: ["#00A1E0", "#00FFFF"],
    align: "center"
});
CFonts.say(`${pkg.description} - By ${pkg.author}`, {
    font: "console",
    colors: ["#E0F7FF"],
    align: "center"
});

// ── Optional HTTP server ──
if (config.system?.useServer) {
    const port = config.system.port || 3000;
    http.createServer((_, res) => {
        res.end(`${pkg.name} is running on port ${port}`);
    }).listen(port, () => {
        log.success(`${pkg.name} runs on port ${port}`);
    });
}

// ── Async start function ──
async function startBot() {
    // ── Load AIRich from NIXCODE ──
    try {
        const nixcodePath = path.join(process.cwd(), "lib", "NIXCODE.js");
        if (fs.existsSync(nixcodePath)) {
            const module = await import(`file://${nixcodePath}`);
            if (module.AIRich) {
                global.AIRich = module.AIRich;
                global.Button = module.Button || class {};
                global.ButtonV2 = module.ButtonV2 || class {};
                global.Carousel = module.Carousel || class {};
                log.success("[AIRich] Loaded from NIXCODE.js");
            } else {
                log.warn("[AIRich] No AIRich export found in NIXCODE.js");
                setFallbackAIRich();
            }
        } else {
            log.warn("[AIRich] NIXCODE.js not found at lib/NIXCODE.js");
            setFallbackAIRich();
        }
    } catch (e) {
        log.error("[AIRich] Failed to load:", e.message);
        setFallbackAIRich();
    }

    // ── Load tools (if exists) ──
    try {
        const toolsPath = path.join(process.cwd(), "tools", "exports.js");
        if (fs.existsSync(toolsPath)) {
            global.tools = require(toolsPath);
            log.success("[Tools] Loaded");
        }
    } catch (e) {
        log.warn("[Tools] Could not load:", e.message);
    }

    // ── Check phone number ──
    if (!config.bot?.phoneNumber || config.bot.phoneNumber.trim() === '') {
        log.error("Phone number is missing in config.json!");
        log.error('Please add "phoneNumber" under "bot" in config.json.');
        process.exit(1);
    }
    log.success(`Phone: ${config.bot.phoneNumber}`);
    log.success(`Prefix: ${config.system?.prefix || "."}`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ── PTERODACTYL CONFIGURATION (for server panel) ──
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (config.pterodactyl) {
        global.domain = config.pterodactyl.panelUrl;
        global.plta = config.pterodactyl.apiKey;
        global.eggs = config.pterodactyl.defaultEgg || 1;
        global.locc = config.pterodactyl.defaultLocation || 1;
        global.nest = config.pterodactyl.defaultNest || 5;
        log.success("[Pterodactyl] Configuration loaded");
    } else {
        log.warn("[Pterodactyl] No pterodactyl configuration found in config.json");
        // Set fallback values to prevent crashes
        global.domain = null;
        global.plta = null;
        global.eggs = null;
        global.locc = null;
        global.nest = null;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ── FULL FORMATTER WITH ALL COMMON METHODS ──
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (!global.formatter) {
        global.formatter = {
            bold: (text) => `*${text}*`,
            italic: (text) => `_${text}_`,
            monospace: (text) => `\`\`\`\n${text}\n\`\`\``,
            inlineCode: (text) => `\`${text}\``,
            quote: (text) => `> ${text}`,
        };
        log.info("[formatter] Full fallback loaded");
    } else {
        if (!global.formatter.bold) global.formatter.bold = (text) => `*${text}*`;
        if (!global.formatter.italic) global.formatter.italic = (text) => `_${text}_`;
        if (!global.formatter.monospace) global.formatter.monospace = (text) => `\`\`\`\n${text}\n\`\`\``;
        if (!global.formatter.inlineCode) global.formatter.inlineCode = (text) => `\`${text}\``;
        if (!global.formatter.quote) global.formatter.quote = (text) => `> ${text}`;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ── TOOLS.MSG HELPERS ──
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (!global.tools) global.tools = {};
    if (!global.tools.msg) global.tools.msg = {};

    if (!global.tools.msg.ucwords) {
        global.tools.msg.ucwords = (str) => {
            if (!str) return '';
            return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        };
    }
    if (!global.tools.msg.formatSize) {
        global.tools.msg.formatSize = (bytes) => {
            if (bytes === 0 || isNaN(bytes)) return '0 B';
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        };
    }
    if (!global.tools.msg.convertMsToDuration) {
        global.tools.msg.convertMsToDuration = (ms) => {
            const seconds = Math.floor(ms / 1000);
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            let parts = [];
            if (days) parts.push(days + 'd');
            if (hours) parts.push(hours + 'h');
            if (minutes) parts.push(minutes + 'm');
            if (secs) parts.push(secs + 's');
            return parts.join(' ') || '0s';
        };
    }
    if (!global.tools.msg.info) {
        global.tools.msg.info = (text) => `${text}`;
    }
    if (!global.tools.msg.generateInstruction) {
        global.tools.msg.generateInstruction = (action, type) => {
            return `*Instruction:* Send a ${type.join(' or ')} with your command.`;
        };
    }
    if (!global.tools.msg.generateCmdExample) {
        global.tools.msg.generateCmdExample = (used, example) => {
            return `*Example:* ${used} ${example}`;
        };
    }
    if (!global.tools.msg.generateNotes) {
        global.tools.msg.generateNotes = (notes) => {
            return notes.map(n => `• ${n}`).join('\n');
        };
    }
    log.info("[tools.msg] Fallback helpers loaded");

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ── TOOLS.API FALLBACK ──
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (!global.tools.api) {
        global.tools.api = {
            createUrl: (base, path, params) => {
                const bases = {
                    lexcode: 'https://api.lexcode.biz.id',
                    alwayscodex: 'https://api.alwayscodex.com'
                };
                const baseUrl = bases[base] || 'https://api.lexcode.biz.id';
                const url = new URL(baseUrl + path);
                for (const [key, val] of Object.entries(params || {})) {
                    url.searchParams.append(key, val);
                }
                return url.toString();
            }
        };
        log.info("[tools.api] Fallback loaded");
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ── TOOLS.CMD HANDLER ──
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (!global.tools.cmd) global.tools.cmd = {};

    if (!global.tools.cmd.handleError) {
        global.tools.cmd.handleError = async (ctx, error, showTrace = false) => {
            console.error("[Command Error]", error);
            const msg = showTrace ? error.stack : error.message;
            try {
                await ctx.reply(`❌ Error: ${msg || "Unknown error"}`);
            } catch (_) {
                console.error("Could not send error reply");
            }
        };
        log.info("[tools.cmd] handleError fallback loaded");
    }

    // ── Finally, load main.js ──
    try {
        require("./main.js");
    } catch (e) {
        log.error("Failed to load main.js:", e.message);
        process.exit(1);
    }
}

function setFallbackAIRich() {
    global.AIRich = class {
        constructor() { this._data = {}; }
        setTitle(t) { this._data.title = t; return this; }
        setBody(b) { this._data.body = b; return this; }
        setFooter(f) { this._data.footer = f; return this; }
        addTable(t) { this._data.table = t; return this; }
        addText(t) { this._data.text = t; return this; }
        addTip(t) { this._data.tip = t; return this; }
        addSuggest(s) { this._data.suggest = s; return this; }
        async send(jid, opts) {
            let msg = "";
            if (this._data.title) msg += `*${this._data.title}*\n\n`;
            if (this._data.body) msg += `${this._data.body}\n\n`;
            if (this._data.table) {
                msg += "```\n";
                this._data.table.forEach(row => msg += row.join(" | ") + "\n");
                msg += "```\n\n";
            }
            if (this._data.tip) msg += `_${this._data.tip}_\n\n`;
            if (this._data.suggest) msg += `Suggestions: ${this._data.suggest.join("  ")}`;
            if (this._data.footer) msg += `\n\n_${this._data.footer}_`;
            const sock = global.ctx?.core || global.sock;
            if (sock?.sendMessage) {
                await sock.sendMessage(jid, { text: msg }, opts);
            }
        }
    };
    global.Button = class {};
    global.ButtonV2 = class {};
    global.Carousel = class {};
    log.warn("[AIRich] Using fallback dummy class");
}

// ── Start ──
startBot().catch((err) => {
    console.error(util.styleText("red", "[x]"), "Unhandled error:", err.message);
    process.exit(1);
});