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

  const staffProfile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});
  if(!settings.General.PermissionBypass.includes(message.author.id)){
    let notStaff = new Discord.MessageEmbed()
    .setDescription(`You're not a staff member.`)
    .setColor(T.red)
    if(!staffProfile) return message.channel.send(notStaff);
}

  let leaderUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let embed3 = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription("Please specify a user!")
  if(!leaderUser) return message.channel.send(embed3);

  let leaderRole = message.guild.roles.cache.find(role => role.id === settings.Roles.PublicFactionLeader);
  let userProfile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: leaderUser.user.id});

  let embed21 = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription(`You can't give staff Faction Leader.`)
  if(userProfile) return message.channel.send(embed21)


  let embed22 = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription(`${leaderUser} already has this role.`)
  if(leaderUser.roles.cache.has(leaderRole.id)) return message.channel.send(embed22);


  let embed23 = new Discord.MessageEmbed()
  .setColor(T.green)
  .setDescription(`Successfully gave ${leaderUser} Faction Leader.`)
  leaderUser.roles.add(leaderRole).then(() => {
  message.channel.send(embed23)});


  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
  .setColor(T.orange)
  .setDescription(`${message.author} gave ${leaderUser} Faction Leader. (${leaderRole})`)
  modLogs.send(embed24)

}
exports.help = {
  name: 'fleader',
  aliases: ['facleader'],
}
