const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const lockPerms = require('../lockPerms.json');
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
  
  if(!settings.General.PermissionBypass.includes(message.author.id)){
  let embed1 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("You don't have permission to use this command!")
  const staffProfile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});
  if(!staffProfile) return message.channel.send(embed1);
 
  let notHigh = new Discord.MessageEmbed()
  .setDescription(`Your staff ranking can't unlock the Discord!`)
  .setColor(T.red)
  if(staffProfile.rank <= 4) return message.channel.send(notHigh)
}

  let lockedEmbed = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription(`The Discord has been unlocked!`)
  try{
    let editrole = message.guild.roles.cache.find(r => r.id === settings.Roles.Member)
    editrole.setPermissions(editrole.permissions.add('SEND_MESSAGES'))
    message.channel.send(lockedEmbed)
  } catch(e){
    console.log(e)
  }

  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription(`${message.author} unlocked ${message.channel}. (${message.channel.name})`)
  modLogs.send(embed24)

}
exports.help = {
  name: 'unlock',
  aliases: ['unlockall'],
}
