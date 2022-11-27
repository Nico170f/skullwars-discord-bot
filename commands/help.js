const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');


exports.run = async (client, message, args) => { //eslint-no-unused-vars
G.updateGuild();


  let prefix = settings.General.Prefix;

  let help = new Discord.MessageEmbed()
    .setColor(T.main)
    .setDescription("Underneath is a list of available help categories:")
    .addField("Categories:", `➜ Commands\n➜ Staffpoints\n➜ Config`)
    .setThumbnail(message.guild.iconURL())








  let config = new Discord.MessageEmbed()
    .setAuthor(`${message.guild.name}`, message.guild.iconURL())
    .setColor(T.main)
    .setDescription("Currently disabled.")
    .setTimestamp()
    .setFooter("Skullwars", message.guild.iconURL());




  let basichelp = `\`${prefix}help\`, \`${prefix}staff\`, \`${prefix}stafftop\`, \`${prefix}messagetop\`, \`${prefix}profile\`, \`${prefix}boost\`, \`${prefix}release\`, \`${prefix}ip\`, \`${prefix}links\`, \`${prefix}stats\`, \`${prefix}store\`, \`${prefix}rules\`, \`${prefix}invite\`, \`${prefix}twitter\`, \`${prefix}userinfo\`, \`${prefix}serverinfo\`, \`${prefix}memberinfo\`, \`${prefix}suggest\`, \`${prefix}uptime\`, \`${prefix}add\`, \`${prefix}remove\`, \`${prefix}messages\`, \`${prefix}leaderboard\`, \`${prefix}ticket\``;

  let staffhelp = `\`${prefix}purge\`, \`${prefix}ban\`, \`${prefix}unban\`, \`${prefix}kick\`, \`${prefix}mute\`, \`${prefix}unmute\`, \`${prefix}embed\`, \`${prefix}latency\`, \`${prefix}remind\`, \`${prefix}close\`, \`${prefix}request\`, \`${prefix}lock\`, \`${prefix}unlock\`, \`${prefix}fplaying\`, \`${prefix}fleader\`, \`${prefix}claim\`, \`${prefix}archive\``;

  let ownerhelp = `\`${prefix}reset\`, \`${prefix}staffadd\`, \`${prefix}staffremove\`, \`${prefix}staffign\`, \`${prefix}promote\`, \`${prefix}demote\``;

  

  let commands = new Discord.MessageEmbed()
    .setAuthor(`${message.guild.name}`, message.guild.iconURL())
    .setColor(T.main)
    .setDescription("This is a list of all commands you can use. *Basic Commands* are for the average user. *Staff Commands* are only avaliable for staff and above.")
    .addField("**Basic Commands:**", basichelp)
    .addField("**Staff Commands:**", staffhelp)
    .addField("**Management Commands:**", ownerhelp)
    .setTimestamp()
    .setFooter("Skullwars", message.guild.iconURL)

  let ban = settings.Points.ban;
  let mute = settings.Points.mute;
  let kick = settings.Points.kick;
  let ticketclose = settings.Points.ticketClose;




  let staffpoints = new Discord.MessageEmbed()
  .setAuthor(`${message.guild.name}`, message.guild.iconURL())
  .setColor(T.main)
  .setDescription(`As a staff in this Discord, you are rewarded *"staff points"* for doing certain actions. Current staff ranking can be \ndisplayed by using:  \`${prefix}stafftop\``)
  .addField("Moderation:", `Ban ➜ \`${ban}\`\nKick ➜ \`${kick}\`\nMute ➜ \`${mute}\``)
  .addField("Support:", `Closing a ticket ➜ \`${ticketclose}\`\nAnswering in ticket ➜ \`10\`\nGeneral chat message ➜ \`1\``)
  .addField("Other:", `Activity in voicecall ➜ \`2/min\`\nInvites ➜ \`NAN\``)
  .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")

  let embed99 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("You don't have permission to show the server config!")

  //if (!args[0]) message.channel.send(help);
  if(!args[0]) return message.channel.send(help);
  if (args[0].toLowerCase() === "config") {
    if (!message.member.hasPermission('ADMINISTRATOR')){
      return message.channel.send(embed99);
    }
  } else if (args[0].toLowerCase() === "commands") {
    return message.channel.send(commands);
  } else if (args[0].toLowerCase() === "staffpoints"){
    return message.channel.send(staffpoints);
  } else {
    return message.channel.send(help);
  }

}
exports.help = {
  name: 'help',
  aliases: ['h'],
}