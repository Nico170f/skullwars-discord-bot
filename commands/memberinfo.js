const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async(client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();

  let mEmbed = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription(`➜ Total Members: ${message.guild.memberCount}\n➜ Bots: ${message.guild.members.cache.filter(m => m.user.bot).size}\n\n**Member Status:**\n➜ Online: \`${message.guild.members.cache.filter(o => o.presence.status === 'online').size}\`\n➜ Away: \`${message.guild.members.cache.filter(i => i.presence.status === 'idle').size}\`\n➜ DND: \`${message.guild.members.cache.filter(dnd => dnd.presence.status === 'dnd').size}\`\n➜ Offline: \`${message.guild.members.cache.filter(off => off.presence.status === 'offline').size}\``)
  .setAuthor (`${message.guild.name}:`, message.guild.iconURL())
  .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")
  message.channel.send({embed: mEmbed});
  

}
exports.help = {
  name: 'memberinfo',
  aliases: ['mb'],
}
