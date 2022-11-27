const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings =  require("../settings.json");
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async(client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();
  let m = message.guild.id;
  let g = settings.General.Servers;
  let Disabled = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription("Command invalid in this guild.")
  if(m != g.Public) return message.channel.send(Disabled);

  const embed1 = new Discord.MessageEmbed()
  .setDescription(`Please create a ticket in: <#${settings.Support.TicketChannelID}>`)
  .setColor(T.blank)
  message.channel.send(embed1)

}
exports.help = {
  name: 'new',
  aliases: ['ticket'],
}
