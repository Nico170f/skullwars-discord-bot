const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const moment = require("moment")
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

  if(!settings.General.PermissionBypass.includes(message.author.id)){

  let notStaff = new Discord.MessageEmbed()
    .setDescription(`You are not a staff member.`)
    .setColor(T.blank)
  if (message.author.id !== "212878816362758144") {
    if (!staffProfile) return message.channel.send(notStaff);
  }

  let notHigh = new Discord.MessageEmbed()
    .setDescription(`You are not allowed to archive tickets.`)
    .setColor(T.blank)
  if (message.author.id !== "212878816362758144") {
    if (staffProfile.rank < 6) return message.channel.send(notHigh)
  }
  }

  let ticketdata = await mongoose.models.Ticket.findOne({
    guildID: message.guild.id,
    channelID: message.channel.id
  });

  let embed2 = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription("You can only archive tickets!")
  if (!ticketdata) return message.channel.send(embed2)


  let ticketuser = ticketdata.userID;
  let ticketid = message.channel.name.replace("ticket-", "")
  let date = moment(new Date()).format('DD-MMM-YYYY h:mm A')
  fs.appendFile(`././ticketlogs/ticket-${ticketid}.txt`, `\n➖➖➖➖➖➖\nTicket has been archived by ➜ ${message.member.user.tag}\n${date}\n`, function (err) {
    if (err) throw err;
  });

  var channel = message.channel;
  let supportRole = message.guild.roles.cache.find(r => r.id === settings.Roles.Support) //settings.supportRole;
  let managementRole = message.guild.roles.cache.find(r => r.id === settings.Roles.Management)

  var archiveCategory = message.guild.channels.cache.find(c => c.id == settings.Categories.Archive && c.type == "category");
  message.channel.setParent(archiveCategory.id/*, {lockPermissions : false}*/)


  let finished = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription(`This ticket has been archived by <@${message.author.id}>`)
  setTimeout(function() {
    message.channel.send(finished)
    channel.updateOverwrite(channel.guild.roles.everyone, { VIEW_CHANNEL: false });
    channel.updateOverwrite(managementRole, { VIEW_CHANNEL: true });
    channel.updateOverwrite(ticketuser, { VIEW_CHANNEL: true });
  }, 1000)

  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
  .setColor(T.orange)
  .setDescription(`${message.author} archived a ticket. (${message.channel.name})`)
  modLogs.send(embed24)

  await mongoose.models.Ticket.deleteOne({guildID: message.guild.id.toString(), channelID: message.channel.id.toString()});


}
exports.help = {
  name: 'archive',
  aliases: ['moveticket'],
}