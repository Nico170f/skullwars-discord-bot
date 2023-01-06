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
  

  const staffProfile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});
  if(!settings.General.PermissionBypass.includes(message.author.id)){
  let notStaff = new Discord.MessageEmbed()
  .setDescription(`You are not a staff member!`)
  .setColor(T.red)
  if(!staffProfile) return message.channel.send(notStaff);
}


let embed1 = new Discord.MessageEmbed()
.setColor(T.red)
.setDescription("Bot does not have permissions!")
if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send(embed1)


let mutee = message.mentions.members.first() || message.guild.members.cache.get(args [0]);
let embed2 = new Discord.MessageEmbed()
.setColor(T.red)
.setDescription("Please select a user to be unmuted!")
if(!mutee) return message.channel.send(embed2)


//console.log(mutee.id.toString())
if(!(await mongoose.models.User.exists({guildID: message.guild.id.toString(), userID: mutee.id.toString(), Muted: true}))) { 
  let embed4 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("User is not muted!")
  return message.channel.send(embed4)
}



  let reason = args.slice(1).join(" ");
  if(!reason) reason = "No reason given!"
  let muterole = message.guild.roles.cache.find(role => role.id === settings.Roles.Muted)

  let embed5 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("Please create a mute role!")
  if (!muterole) return message.channel.send(embed5)


  mutee.roles.remove(muterole)
  let embed6 = new Discord.MessageEmbed()
  .setColor(T.green)
  .setDescription(`User was successfully unmuted! (${mutee.user.id})`)
  message.channel.send(embed6)

  


let profile = await mongoose.models.User.findOne({guildID: message.guild.id.toString(), userID: mutee.id.toString(), Muted: true});
    profile.Muted = false;
    await profile.save();

  let embedd = new Discord.MessageEmbed()
  .setColor(T.green)
  .setDescription("A user has been __unmuted!__")
  .addField("Moderator:", `<@!${message.author.id}>\n(${message.author.id})`, true)
  .addField("Offender:", `<@!${mutee.user.id}>\n(${mutee.user.id})`, true)
  .addField("Reason:", reason)
  .setThumbnail(mutee.user.displayAvatarURL()) 
  let sChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  sChannel.send(embedd)

}
exports.help = {
  name: 'unmute',
  aliases: ['un'],
}
