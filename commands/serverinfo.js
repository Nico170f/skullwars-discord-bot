const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings =  require("../settings.json");
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async(client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();

  let online = message.guild.members.cache.filter(member => member.user.presence.status !== 'offline');
  let sEmbed = new Discord.MessageEmbed()
  .setColor(T.main)
  .addField("**Server Owner:**", `${message.guild.owner}`, true)
  .addField ("**Member Count:**", `${message.guild.memberCount}`, true)
  .addField ("**Online:**", online.size, true)
  .addField ("**Region:**", `${message.guild.region}`, true)
  .addField("**ID:**", `${message.guild.id}`, true)
  //.setFooter("Skullwars", message.guild.iconURL)
  .setThumbnail(message.guild.iconURL())
  message.channel.send({embed: sEmbed});


}
exports.help = {
  name: 'serverinfo',
  aliases: ['si'],
}
