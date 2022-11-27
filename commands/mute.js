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
  if(message.author.id !== "212878816362758144") {
  if(!staffProfile) return message.channel.send(notStaff);
  }
}


      let muterole = message.guild.roles.cache.find(role => role.id === settings.Roles.Muted);
      let embed1 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription("Muted role not found!")
      if(!muterole) return message.channel.send(embed1);


      let muteuser = message.mentions.members.first() || message.guild.members.cache.get(args [0]);
      let embed3 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription("Please specify a user to be muted!")
      if(!muteuser) return message.channel.send(embed3);

    let userprofile1 = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: muteuser.user.id});
    let embed21 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`You can't mute a staff member!`)
    if(userprofile1) return message.channel.send(embed21)


if(await mongoose.models.User.exists({guildID: message.guild.id.toString(), userID: muteuser.id.toString(), Muted: true})) {    
  let embed4 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription(`User is already muted! (${muteuser.id})`)
  return message.channel.send(embed4);
}

  let a = args[1];
  if(!a || (!a.includes("s") && a.includes("m") && a.includes("h") && a.includes("d"))){
    let embed5 = new Discord.MessageEmbed()
    .setColor(T.green)
    .setDescription(`User was successfully muted! (${muteuser.id})`)

    muteuser.roles.add(muterole).then(() => {
    message.channel.send(embed5)})
  } else {
    let embed5 = new Discord.MessageEmbed()
    .setColor(T.green)
    .setDescription(`User has successfully muted for \`${args[1]}\`! (${muteuser.id})`)
    muteuser.roles.add(muterole).then(() => {
    message.channel.send(embed5)})

    setTimeout(async function () {
      muteuser.roles.remove(muterole);
      let profile = await mongoose.models.User.findOne({guildID: message.guild.id.toString(), userID: muteuser.id.toString()});
      profile.Muted = false;
      await profile.save();
    }, ms(args[1]));
  }




          let embed6 = new Discord.MessageEmbed()
          .setColor(T.orange)
          .setDescription("A user has been __muted!__")
          .addField("Moderator:", `<@!${message.author.id}>\n(${message.author.id})`, true)
          .addField("Offender:", `<@!${muteuser.user.id}>\n(${muteuser.user.id})`, true)
          //.addField("Reason:", reason)
          .setThumbnail(muteuser.user.displayAvatarURL()) 
          //.setThumbnail(cfg[message.guild.id].thumbnail)
          let sChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
          sChannel.send(embed6)
  

          let userprofile = await mongoose.models.User.findOne({guildID: message.guild.id, userID: muteuser.id});
          if(!userprofile){
            userprofile = new mongoose.models.User({guildID: message.guild.id, userID: muteuser.id, Muted: true});
            await userprofile.save();
          } else {
            userprofile.Muted = true;
            await userprofile.save();
          }
          

        let profile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});
        if(!profile) {
          console.log(`Missing staff profile - could not update user: ${message.author.tag}`)
        } else {
          profile.pointsTotal += settings.Points.mute;
          profile.pointsWeekly += settings.Points.mute;
          profile.pointsMonthly += settings.Points.mute;
          profile.moderation.mutes += 1;
          await profile.save();
        }

}
exports.help = {
  name: 'mute',
  aliases: ['m'],
}
