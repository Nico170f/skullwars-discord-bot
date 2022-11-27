const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
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
  

  const staffProfile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  });

  let notStaff = new Discord.MessageEmbed()
    .setDescription(`You are not a staff member.`)
    .setColor(T.blank)
  if (message.author.id !== "212878816362758144") {
    if (!staffProfile) return message.channel.send(notStaff);
  }

  if(!(await mongoose.models.Ticket.exists({guildID: message.guild.id.toString(), channelID: message.channel.id.toString()}))) { 
    let embed = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription("This command can only be run in tickets.")
    return message.channel.send(embed)
  }

  let notHigh = new Discord.MessageEmbed()
    .setDescription(`You are not allowed to claim tickets.`)
    .setColor(T.blank)
  if (message.author.id !== "212878816362758144") {
    if (staffProfile.rank < 4) return message.channel.send(notHigh)
  }

  let ticketdata = await mongoose.models.Ticket.findOne({
    guildID: message.guild.id,
    channelID: message.channel.id
  });

  let embed2 = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription("This command can only be run in tickets.")
  if (!ticketdata) return message.channel.send(embed2)

  var channel = message.channel;
  let supportRole = message.guild.roles.cache.find(r => r.id === settings.Roles.Support)
  let jradmin = message.guild.roles.cache.find(r => r.id === settings.Roles.JrAdmin)
  let admin = message.guild.roles.cache.find(r => r.id === settings.Roles.Admin)
  let sradmin = message.guild.roles.cache.find(r => r.id === settings.Roles.SrAdmin)
  let manager = message.guild.roles.cache.find(r => r.id === settings.Roles.Manager)
  let operator = message.guild.roles.cache.find(r => r.id === settings.Roles.Operator)
  let rank;

  if(staffProfile.rank === 4){
    rank = "Jr. Admin";
    setTimeout(function() {
      channel.updateOverwrite(supportRole, { VIEW_CHANNEL: false });
      channel.updateOverwrite(jradmin, { VIEW_CHANNEL: true });
      channel.updateOverwrite(admin, { VIEW_CHANNEL: true });
      channel.updateOverwrite(sradmin, { VIEW_CHANNEL: true });
      channel.updateOverwrite(manager, { VIEW_CHANNEL: true });
      channel.updateOverwrite(operator, { VIEW_CHANNEL: true });
    }, 1000)
  }
  if(staffProfile.rank === 5){
    rank = "Admin";
    setTimeout(function() {
      channel.updateOverwrite(supportRole, { VIEW_CHANNEL: false });
      channel.updateOverwrite(admin, { VIEW_CHANNEL: true });
      channel.updateOverwrite(sradmin, { VIEW_CHANNEL: true });
      channel.updateOverwrite(manager, { VIEW_CHANNEL: true });
      channel.updateOverwrite(operator, { VIEW_CHANNEL: true });
    }, 1000)
  }
  if(staffProfile.rank === 6){
    rank = "Sr. Admin";
    setTimeout(function() {
      channel.updateOverwrite(supportRole, { VIEW_CHANNEL: false });
      channel.updateOverwrite(sradmin, { VIEW_CHANNEL: true });
      channel.updateOverwrite(manager, { VIEW_CHANNEL: true });
      channel.updateOverwrite(operator, { VIEW_CHANNEL: true });
    }, 1000)
  }
  if(staffProfile.rank === 7){
    rank = "Manager";
    setTimeout(function() {
      channel.updateOverwrite(supportRole, { VIEW_CHANNEL: false });
      channel.updateOverwrite(manager, { VIEW_CHANNEL: true });
      channel.updateOverwrite(operator, { VIEW_CHANNEL: true });
    }, 1000)
    
  }
  if(staffProfile.rank > 7){
    rank = "Operator";
    setTimeout(function() {
      channel.updateOverwrite(supportRole, { VIEW_CHANNEL: false });
      channel.updateOverwrite(operator, { VIEW_CHANNEL: true });
    }, 1000)
  }
  let finished = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription(`This ticket has been claimed by <@${message.author.id}>\n➜ From now on, only users with ${rank} and higher are able to see this ticket.`)
  message.channel.send(finished)

  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription(`${message.author} claimed ticket: ${message.channel}. (${message.channel.name})`)
  modLogs.send(embed24)
}
exports.help = {
  name: 'taketicket',
  aliases: ['take', 'mine', 'claim', 'claimticket'],
}
