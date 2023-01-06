const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async(client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();

  let embed = new Discord.MessageEmbed()
  .setAuthor("SkullWars | Links", message.guild.iconURL())
  .setDescription(`Below is listed all of the domains currently associated with the SkullWars Network.`)
  .addField("Links:", `Store ➜ https://store.skullwars.net/\nRules ➜ https://rules.skullwars.net/\nInvite ➜ https://discord.skullwars.net/\nTwitter ➜ https://twitter.skullwars.net/`)
  .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656401881399296/SkullWars_Tickets_Sword.png")
  .setColor(T.blank)
  .setTimestamp()
  .setFooter("Skullwars")
  message.channel.send(embed)

}
exports.help = {
  name: 'links',
  aliases: ['website'],
}
