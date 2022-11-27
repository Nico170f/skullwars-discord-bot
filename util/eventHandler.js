const reqEvent = (event) => require(`../events/${event}`);
const guildCreate = require('../events/guildCreate.js');

/**
 * Registers and forwards all events to their handlers
 * @param  {Discord.Client} bot The client to handle the events for
 */
module.exports = bot => {
    bot.on("ready", () => { reqEvent("ready")(bot); });
    bot.on("reconnecting", () => reqEvent("reconnecting")(bot));
    bot.on("disconnect", () => reqEvent("disconnect")(bot));
    bot.on("warn", reqEvent("warn"));
    bot.on("error", reqEvent("error"));

};
