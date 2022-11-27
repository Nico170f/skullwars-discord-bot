const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async (client, message, args) => { //eslint-no-unused-vars
G.updateGuild();

let guildStats = await mongoose.models.Guild.findOne({
  guildID: settings.General.Servers.Public
});


  let embed = new Discord.MessageEmbed()
    .setAuthor("Stats | SkullWars", message.guild.iconURL())
    .setDescription(`Showing statistics from the SkullWars Discord server.`)
    .addField("Statistics:", `\nUnique Discord users ➜ \`` + guildStats.uniqueJoins.length + `\`\nTotal messages sent ➜ \`` + guildStats.stats.messages + `\`\nCommands issued ➜ \`` + guildStats.stats.commands+ `\`\nFTOP Updates ➜ \`` + guildStats.stats.ftopUpdates + `\``)
    //.addField("Unique Users:", guild.uniqueJoins.length)
    //.addField("Messaegs sent:", guild.stats.messages)
    //.addField("Commands issued:", guild.stats.commands)
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")
    .setColor(T.main)
    message.channel.send(embed)


}
exports.help = {
  name: 'stats',
  aliases: ['st'],
}