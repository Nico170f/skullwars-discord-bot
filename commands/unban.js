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


  const staffProfile = await mongoose.models.Profile.findOne({guildID: settings.General.Servers.Public, userID: message.author.id});

  if(!settings.General.PermissionBypass.includes(message.author.id)){
  let notStaff = new Discord.MessageEmbed()
  .setDescription(`You are not a staff member!`)
  .setColor(T.red)
  if(!staffProfile) return message.channel.send(notStaff);

  let notHigh = new Discord.MessageEmbed()
  .setDescription(`Your staff rank does not allow you do to this!`)
  .setColor(T.red)
    if(staffProfile.rank < 3) return message.channel.send(notHigh)
  }

  const reason = args.slice(1).join(' ');
  client.unbanReason = reason;
  client.unbanAuth = message.author;
  const userid = args[0];


  let embed1 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription('Please specify an ID to unban.')
  if (!userid) return message.channel.send(embed1)


  message.guild.fetchBans().then(bans => console.log(`${bans.first().user.tag} was banned because '${bans.first().reason}'`));


 const banList = await message.guild.fetchBans();
 const bannedUser = banList.find(user => user.id === args[0])


 message.guild.members.unban(userid);
 let embed2 = new Discord.MessageEmbed()
 .setColor(T.red)
 .setDescription(`User was successfuly unbanned! (${userid})`)
 message.channel.send(embed2)

  




  let embed3 = new Discord.MessageEmbed()
  .setColor(T.red)
  .addField("Moderation:", "Unban", true)
  .addField("Reason:", "No reason given!", true)
  .addField("User unbanned:", `<@!${userid}>`, true)
  .addField("Moderator:", `<@!${message.author.id}>`, true)
  let sChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  sChannel.send(embed3)

  


}
exports.help = {
  name: 'unban',
  aliases: ['ub'],
}
