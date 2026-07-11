module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners); // Set max listeners for events

    require("./ready.js")(bot);
    require("./messages.js")(bot);
    require("./welcome.js")(bot);
    require("./call.js")(bot);
}