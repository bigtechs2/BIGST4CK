// Import required modules and dependencies
const { Baileys, Events } = require("@itsreimau/gktw");

module.exports = (bot) => {
    // Event when bot receives a call
    bot.ev.on(Events.Call, async (call) => {
        if (!config.system.antiCall || call.status !== "offer") return;

        const fromJid = call.from;
        const fromId = bot.getId(fromJid);
        const isOwner = bot.checkOwner(fromJid);
        const fromDb = bot.getDb("users", fromJid);

        if (call?.isGroup || isOwner || fromDb?.banned) return;

        const fromPnJid = call.callerPn;
        const fromPnId = bot.getId(fromPnJid);

        console.log(`Incoming call from: ${fromPnJid}`); // Log incoming call

        await bot.core.rejectCall(call.id, fromJid);

        fromDb.banned = true;
        fromDb.save();

        const reportOwner = tools.cmd.getReportOwner();
        if (reportOwner && reportOwner.length > 0) {
            const {
                delay
            } = tools.cmd.calculateDelay(reportOwner.length);
            for (const ownerId of reportOwner) {
                await bot.sendMessage(ownerId + Baileys.S_WHATSAPP_NET, {
                    text: tools.msg.info(`Account @${fromPnId} has been automatically banned for reason ${formatter.inlineCode("Anti Call")}.`),
                    mentions: [fromPnJid]
                });
                await tools.cmd.delay(delay);
            }
        }
        await bot.sendMessage(fromJid, {
            text: tools.msg.info("You have been automatically banned for breaking the rules!"),
            buttons: [{
                text: "Contact Owner",
                id: "/owner"
            }]
        });
    });
};