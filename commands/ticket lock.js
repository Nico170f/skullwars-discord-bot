const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async (client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();
  let m = message.guild.id;
  let g = settings.General.Servers;
  let Disabled = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription("Command invalid in this guild.")
  if(m != g.Public) return message.channel.send(Disabled);


  const staffProfile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  });

  if(!(await mongoose.models.Ticket.exists({guildID: message.guild.id.toString(), channelID: message.channel.id.toString()}))) { 
    let embed = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription("This command can only be run in tickets.")
    return message.channel.send(embed)
  }


  if(!settings.General.PermissionBypass.includes(message.author.id)){

  let notStaff = new Discord.MessageEmbed()
    .setDescription(`You are not a staff member.`)
    .setColor(T.blank)
  if (message.author.id !== "212878816362758144") {
    if (!staffProfile) return message.channel.send(notStaff);
  }

  let notHigh = new Discord.MessageEmbed()
    .setDescription(`You are not allowed to lock tickets.`)
    .setColor(T.blank)
  if (message.author.id !== "212878816362758144") {
    if (staffProfile.rank < 6) return message.channel.send(notHigh)
  }
}

  await mongoose.models.Ticket.deleteOne({
    guildID: message.guild.id.toString(),
    channelID: message.channel.id.toString()
  });
  let finished = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription(`This ticket has been locked by <@${message.author.id}>\n➜ From now on this ticket can't be closed.`)
  message.channel.send(finished);

  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription(`${message.author} locked ticket: ${message.channel}. (${message.channel.name})`)
  modLogs.send(embed24)

}
exports.help = {
  name: 'ticketlock',
  aliases: ['lockticket'],
}