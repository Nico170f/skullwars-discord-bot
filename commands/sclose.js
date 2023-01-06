const Discord = require("discord.js")
const moment = require("moment")
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


  const staffProfile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});
  if(!settings.General.PermissionBypass.includes(message.author.id)){
  let notStaff = new Discord.MessageEmbed()
  .setDescription(`You are not a staff member.`)
  .setColor(T.blank)
  if(!staffProfile) return message.channel.send(notStaff);

  let notHigh = new Discord.MessageEmbed()
  .setDescription(`Your current staff ranking does not allow this.`)
  .setColor(T.blank)
    if(staffProfile.rank < 4) return message.channel.send(notHigh)
  }

  
  if(!(await mongoose.models.Ticket.exists({guildID: message.guild.id.toString(), channelID: message.channel.id.toString()}))) { 
    let embed2 = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription("This command only works in tickets.")
    return message.channel.send(embed2)
  }
  
  channelname = message.channel.name
  let ticketid = channelname.replace("ticket-", "")
  let date = moment(new Date()).format('DD-MMM-YYYY h:mm A')
  fs.appendFile(`././ticketlogs/ticket-${ticketid}.txt`,`\n➖➖➖➖➖➖\nTicket closed by ➜ ${message.member.user.username}#${message.member.user.discriminator} ✔️\n${date}`, function (err) {
    if (err) throw err;
  });
  
  message.channel.delete("Ticket closed.");

      let ticketlogs = settings.Channels.TicketLogs;
      let logChannel = message.guild.channels.cache.get(ticketlogs);
      let ticketdata = await mongoose.models.Ticket.findOne({guildID: message.guild.id, channelID: message.channel.id});
      let ticketuser = ticketdata.userID;
      let profile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});


      if(message.author.id != ticketuser){
      if(!profile) {
        console.log(`Missing staff profile - could not update user: ${message.author.tag}`)
      } else {
      profile.pointsTotal += settings.Points.ticketClose;
      profile.pointsWeekly += settings.Points.ticketClose;
      profile.pointsMonthly += settings.Points.ticketClose;
      profile.moderation.tickets += 1;
      await profile.save();
      }
      }


      let logMessage = new Discord.MessageEmbed()
      .setTitle(`Ticket closed!`)
      //.setDescription(`The ticket \`${message.channel.name}\` was closed by ${message.author}. \n${message.author} has now ended ${profile.tickets} tickets!`)
      .setDescription(`A ticket has been closed by ${message.author}. This user has now closed: \`${profile.moderation.tickets}\` tickets! Directly under this message the transcript of this ticket can be found.\n\n➜ Ticket #: \`${ticketid}\`\n➜ Created by: <@!${ticketuser}>\n➜ Closed at: \`${date}\``)
      //.addField("Ticket information:", `➜ Ticket #: \`${ticketid}\`\n➜ Created by: <@!${ticketuser}>\n➜ Closed at: \`${date}\``)
      .setColor(T.green);
      logChannel.send(logMessage);
      await logChannel.send({files: [`././ticketlogs/ticket-${ticketid}.txt`]})
      await mongoose.models.Ticket.deleteOne({guildID: message.guild.id.toString(), channelID: message.channel.id.toString()});

      let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
      let embed24 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription(`${message.author} used silent close in ticket: ${ticketid}`)
      modLogs.send(embed24)

}
exports.help = {
  name: 'sclose',
  aliases: ['sresolved'],
}
