const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async(client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();
  let prefix = settings.General.Prefix;
  let base = new Discord.MessageEmbed()
    .setAuthor(`Skullwars | Leaderboard`, message.guild.iconURL())
    .setColor(T.main)
    .setDescription("This is a list of avaliable leaderboard categories.")
    .addField("Categories:", `Staff ➜ \`${prefix}stafftop\`\nMessages ➜ \`${prefix}messagetop\`\n`)
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")
    message.channel.send(base)

}
exports.help = {
  name: 'top',
  aliases: ['leaderboard'],
}
