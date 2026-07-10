// Import required modules and dependencies
const { Client, CommandHandler } = require("@itsreimau/gktw");
const path     = require("node:path");
const util     = require("node:util");
const events   = require("./events/exports.js");
const middleware = require("./middleware.js");
const chokidar = require("chokidar");

// Baileys proto & generateWAMessageFromContent for relayMessage override
let proto, generateWAMessageFromContent;
try {
    const baileys = require("baileys");
    proto = baileys.proto;
    generateWAMessageFromContent = baileys.generateWAMessageFromContent;
} catch {
    try {
        const baileys = require("@itsreimau/gktw/node_modules/baileys");
        proto = baileys.proto;
        generateWAMessageFromContent = baileys.generateWAMessageFromContent;
    } catch (e) {
        log.warn("[CRM] baileys not found for relayMessage override:", e.message);
    }
}

// Bot configuration
const { bot: botConfig, system } = config;
const diretory = {
    auth:     path.resolve(__dirname, "state"),
    database: path.resolve(__dirname, "database"),
    command:  path.resolve(__dirname, "commands")
};

console.log("Connecting...");

// Function to parse prefix
const parsePrefix = function(prefix) {
    if (typeof prefix !== "string") return prefix;
    var match = prefix.match(/(\/?)(.+)\1([a-z]*)/i);
    if (!match) return prefix;
    var validFlags = Array.from(new Set(match[3])).filter(function(flag) {
        return "gimsuy".includes(flag);
    }).join("");
    try {
        return new RegExp(match[2], validFlags);
    } catch (error) {
        return prefix;
    }
};

// Create bot instance
const bot = new Client({
    auth: {
        dir: diretory.auth,
        phoneNumber: botConfig.phoneNumber,
        usePairingCode: system.usePairingCode,
        customPairingCode: system.customPairingCode,
        useStore: system.useStore
    },
    connection: {
        version: system?.WAVersion,
        alwaysOnline: system.alwaysOnline,
        selfReply: system.selfReply,
        loggerLevel: system?.loggerLevel
    },
    messaging: {
        autoRead: system.autoRead,
        prefix: parsePrefix(botConfig?.prefix)
    },
    database: {
        dir: diretory.database
    },
    owner: [config.owner.id, ...config.owner.co.map(co => co.id)].filter(Boolean)
});

// Initialize events and middleware
events(bot);
middleware(bot);

// Load and run command handler
const cmd = new CommandHandler(bot, diretory.command);
cmd.load();

// Hot reload
chokidar.watch(diretory.command, {
    ignoreInitial: true,
    persistent: true
}).on("change", (filePath) => {
    try {
        delete require.cache[require.resolve(filePath)];
        cmd.load();
        console.log(`[hot-reload] Reloaded: ${path.basename(filePath)}`);
    } catch (err) {
        console.error(`[hot-reload] Error: ${err.message}`);
    }
}).on("add", (filePath) => {
    try {
        cmd.load();
        console.log(`[hot-reload] Added: ${path.basename(filePath)}`);
    } catch (err) {
        console.error(`[hot-reload] Error: ${err.message}`);
    }
}).on("unlink", (filePath) => {
    try {
        delete require.cache[require.resolve(filePath)];
        cmd.load();
        console.log(`[hot-reload] Removed: ${path.basename(filePath)}`);
    } catch (err) {
        console.error(`[hot-reload] Error: ${err.message}`);
    }
});

// ── relayMessage override — save messages to messageDB ──
function setupRelayOverride() {
    try {
        if (!generateWAMessageFromContent || !proto) {
            log.warn("[CRM] relayMessage override skipped — baileys not loaded");
            return;
        }

        const core = bot.core || bot.client || bot.sock || bot.conn;
        if (!core) {
            log.warn("[CRM] relayMessage override skipped — core not found");
            return;
        }

        const _relayMessage = core.relayMessage.bind(core);

        core.relayMessage = async (jid, content, options = {}) => {
            try {
                const waMsg = generateWAMessageFromContent(
                    jid,
                    content,
                    {
                        userJid: core.user?.id,
                        ...options
                    }
                );

                const id = options.messageId || waMsg.key.id;
                waMsg.key.id = id;

                queueMicrotask(() => {
                    try {
                        saveMessage(
                            proto.WebMessageInfo.fromObject(waMsg)
                        );
                    } catch (e) {
                        console.error("DB SAVE FAIL:", e);
                    }
                });

                return _relayMessage(jid, content, {
                    messageId: id,
                    ...options
                });

            } catch (e) {
                console.error("relayMessage override FAIL:", e);
                return _relayMessage(jid, content, options);
            }
        };

        log.success("[CRM] relayMessage override active!");

    } catch (e) {
        log.error("[CRM] relayMessage override error:", e.message);
    }
}

bot.launch()
    .then(() => {
        setupRelayOverride();
    })
    .catch(error => console.error(`Error: ${util.format(error)}`));