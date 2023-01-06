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
  let kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])

  if(!settings.General.PermissionBypass.includes(message.author.id)){
    let notStaff = new Discord.MessageEmbed()
    .setDescription(`You are not a staff member!`)
    .setColor(T.red)
    if(message.author.id !== "212878816362758144") {
    if(!staffProfile) return message.channel.send(notStaff);
  }
  
    let notHigh = new Discord.MessageEmbed()
    .setDescription(`Your staff rank does not allow you do to this!`)
    .setColor(T.red)
    if(message.author.id !== "212878816362758144") {
      if(staffProfile.rank < 2) return message.channel.send(notHigh)
    }
  
    let embed1 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("Please provide a user to kick!")
    if (!kickMember) return message.channel.send(embed1);
  }

  let profile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: kickMember.user.id
  });

  if(profile){
    let isStaff = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("Staff members can't be kicked.")
    return message.channel.send(isStaff)
  }


  let reason = args.slice(1).join(" ")
  if (!reason) reason = "No reason given!";

  let embed2 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("Bot missing permissions!")
  if(!message.guild.me.hasPermission(["KICK_MEMBERS", "ADMINISTRATOR"])) return message.channel.send(embed2);

  let userprofile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: kickMember.user.id});
  let embed21 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription(`You can't kick a staff member! Please remove them first with \`${settings.General.Prefix}staff remove\`!`)
  if(userprofile) return message.channel.send(embed21)

  
      kickMember.kick()
      let embed3 = new Discord.MessageEmbed()
      .setColor(T.green)
      .setDescription(`${kickMember.user.username} (${kickMember.user.id}) has been kicked!`)
      message.channel.send(embed3)


      let embed4 = new Discord.MessageEmbed()
      .setColor(T.orange)
      //.setAuthor(`${message.guild.name}`, message.guild.iconURL)
      .setDescription("A user has been __kicked!__")
      .addField("Moderator:", `<@!${message.author.id}>\n(${message.author.id})`, true)
      .addField("Offender:", `<@!${kickMember.user.id}>\n(${kickMember.user.id})`, true)
      .addField("Reason:", reason)
      .setThumbnail(banMember.user.defaultAvatarURL)
      let sChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
      sChannel.send(embed4)

      if(!staffProfile) {
        console.log(`Missing staff profile - could not update user: ${message.author.tag}`)
      } else {
        staffProfile.pointsTotal += settings.Points.kick;
        staffProfile.pointsWeekly += settings.Points.kick;
        staffProfile.pointsMonthly += settings.Points.kick;
        staffProfile.moderation.mutes += 1;
        await staffProfile.save();
      }


}
exports.help = {
  name: 'kick',
  aliases: ['k'],
}
