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
  .setAuthor("SkullWars | Connections", message.guild.iconURL())
  .setDescription(`Below is listed all of the currently available addresses that are linked to the SkullWars Network.`)
  .addField("Connections:", `➜ Play.SkullWars.Net`)
  .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656401881399296/SkullWars_Tickets_Sword.png")
  .setColor(T.blank)
  .setTimestamp()
  .setFooter("Skullwars")
  message.channel.send(embed)


}
exports.help = {
  name: 'ip',
  aliases: ['connection', "ipaddress"],
}
