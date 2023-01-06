const Discord = require("discord.js")
const settings =  require("../settings.json");
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
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

  let notHigh = new Discord.MessageEmbed()
  .setDescription(`Your staff rank does not allow you do to this!`)
  .setColor(T.red)
    if(staffProfile.rank < 3) return message.channel.send(notHigh)
  }

  let adduser = args.join(" ");
  let user = message.guild.members.cache.find(val => val.user.tag == adduser) || message.guild.members.cache.get(adduser) || message.mentions.members.first();
  let embed1 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("Please provide a user to ban!")
  if(!user) return message.channel.send(embed1)


  let profile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: user.user.id
  });

  if(profile){
    let isStaff = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("Staff members can't be banned.")
    return message.channel.send(isStaff)
  }

  let reason1 = args.slice(1).join(" ");
  if(!reason1) reason1 = "No reason given!"

  let embed2 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("Bot missing permissions!")
  if(!message.guild.me.hasPermission(["BAN_MEMBERS"])) return message.channel.send(embed2)


  user.ban({reason: reason1})


let embed3 = new Discord.MessageEmbed()
.setColor(T.green)
.setDescription(`User has been banned! (${user.user.id})`)
message.channel.send(embed3)





      let embed69 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription("A user has been __banned!__")
      .addField("Moderator:", `<@!${message.author.id}>\n(${message.author.id})`, true)
      .addField("Offender:", `<@!${user.user.id}>\n(${user.user.id})`, true)
      .addField("Reason:", reason1)
      .setThumbnail(user.user.displayAvatarURL())
      let sChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
      sChannel.send(embed69)

  
      if(!staffProfile) {
        console.log(`Missing staff profile - could not update user: ${message.author.tag}`)
      } else {
        staffProfile.pointsTotal += settings.Points.ban;
        staffProfile.pointsWeekly += settings.Points.ban;
        staffProfile.pointsMonthly += settings.Points.ban;
        staffProfile.moderation.bans += 1;
      await staffProfile.save();
      }

};
exports.help = {
  name: 'ban',
  aliases: ['b'],
}