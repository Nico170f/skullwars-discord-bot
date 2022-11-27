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

  if(!settings.General.PermissionBypass.includes(message.author.id)){
  let notStaff = new Discord.MessageEmbed()
    .setDescription(`This command can only be issued by staff.`)
    .setColor(T.blank)
  if (!staffProfile) return message.channel.send(notStaff);

  let notHigh = new Discord.MessageEmbed()
    .setDescription(`Your staff ranking does not allow this.`)
    .setColor(T.blank)
    if (staffProfile.rank < 7) return message.channel.send(notHigh)
  }


  let noexist = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`No staff members were found in the database!`)
  let exist = await mongoose.models.Profile.findOne({
    guildID: settings.General.Servers.Public
  });
  if (!exist) return message.channel.send(noexist)


  let nostaff = new Discord.MessageEmbed()
    .setDescription(`Please mention a staff member!`)
    .setColor(T.blank)
  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!user) return message.channel.send(nostaff)


  let profile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: user.user.id
  });
  if (!profile) {
    let nostaff1 = new Discord.MessageEmbed()
      .setDescription(`This user is not a staff member.`)
      .setColor(T.red)
    return message.channel.send(nostaff1)
  }

  let noign = new Discord.MessageEmbed()
    .setDescription(`Please specify the new IGN!`)
    .setColor(T.blank)
  if (!args[1]) return message.channel.send(noign)

  try {
    user.setNickname(user.nickname.replace(profile.IGN, args[1]))
    profile.IGN = args[1];
    profile.save();
  } catch (error) {
    message.channel.send
  }



  let lmalmalmo = new Discord.MessageEmbed()
    .setDescription(`➜ Successfully set <@!${user.user.id}>'s IGN to: \`${args[1]}\``)
    .setColor(T.green)
  message.channel.send(lmalmalmo)

  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription(`${message.author} changed the IGN of <@!${user.user.id}> to \`${args[1]}\`.`)
  modLogs.send(embed24)

}
exports.help = {
  name: 'staffign',
  aliases: ['sign'],
}