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

  let permRole = settings.Roles.Support;
  let embed1 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("You don't have permission to use this command!")
  if(!message.member.roles.cache.has(permRole)) return message.channel.send(embed1);

  
  if(!(await mongoose.models.Ticket.exists({guildID: message.guild.id.toString(), channelID: message.channel.id.toString()}))) { 

    let embed2 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("You can only close tickets!")
    return message.channel.send(embed2)

  }
  
  channelname = message.channel.name
  let ticketid = channelname.replace("ticket-", "")
  let date = moment(new Date()).format('DD-MMM-YYYY h:mm A')
  fs.appendFile(`././ticketlogs/ticket-${ticketid}.txt`,`\n➖➖➖➖➖➖\nTicket closed by ➜ ${message.member.user.username}#${message.member.user.discriminator} ✔️\n${date}`, function (err) {
    if (err) throw err;
  });//writes at the end of the file who closed the ticket
  
  message.channel.delete("Ticket closed.");

      let ticketlogs = settings.Channels.TicketLogs;
      let logChannel = message.guild.channels.cache.get(ticketlogs);
      let ticketdata = await mongoose.models.Ticket.findOne({guildID: message.guild.id, channelID: message.channel.id});
      let ticketuser = ticketdata.userID;
      let profile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});

      let closed;
      if(message.author.id != ticketuser){
      if(!profile) {
        console.log(`Missing staff profile - could not update user: ${message.author.tag}`)
        closed = "Unknown"
      } else {
      profile.pointsTotal += settings.Points.ticketClose;
      profile.pointsWeekly += settings.Points.ticketClose;
      profile.pointsMonthly += settings.Points.ticketClose;
      profile.moderation.tickets += 1;
      closed = profile.moderation.tickets;
      await profile.save();
      }
      }





      let logMessage = new Discord.MessageEmbed()
      .setTitle(`Ticket closed!`)
      //.setDescription(`The ticket \`${message.channel.name}\` was closed by ${message.author}. \n${message.author} has now ended ${profile.tickets} tickets!`)
      .setDescription(`A ticket has been closed by ${message.author}. This user has now closed: \`${closed}\` tickets! Directly under this message the transcript of this ticket can be found.\n\n➜ Ticket #: \`${ticketid}\`\n➜ Created by: <@!${ticketuser}>\n➜ Closed at: \`${date}\``)
      //.addField("Ticket information:", `➜ Ticket #: \`${ticketid}\`\n➜ Created by: <@!${ticketuser}>\n➜ Closed at: \`${date}\``)
      .setColor(T.green);
      logChannel.send(logMessage);
      await logChannel.send({files: [`././ticketlogs/ticket-${ticketid}.txt`]})

  
    let parentt = message.channel.parent.name;
    //console.log(parentt)
    const dmEmbed = new Discord.MessageEmbed()
    .setColor(T.main)
    .setAuthor('Ticket closed', "https://media.discordapp.net/attachments/569219717559222307/807583429997756426/server-icon_1.png")
    .setDescription(`Ticket category ➜ ${parentt}\nClosed by ➜ ${message.author.tag}\n`)
    .setFooter('Skullwars')
    .setTimestamp()

    
    try {
        client.users.cache.get(ticketuser).send(dmEmbed)
        await client.users.cache.get(ticketuser).send({files: [`././ticketlogs/ticket-${ticketid}.txt`]})
    } catch(err) {
        console.log("ERR: " + err)
        console.log("Could not DM user ticket receipt!")
    }

    await mongoose.models.Ticket.deleteOne({guildID: message.guild.id.toString(), channelID: message.channel.id.toString()});

    let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
    let embed24 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`${message.author} closed ticket: ${message.channel}. (${message.channel.name})`)
    modLogs.send(embed24)

}
exports.help = {
  name: 'close',
  aliases: ['resolved'],
}
