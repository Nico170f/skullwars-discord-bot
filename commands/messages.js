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

  let user;
  let profile;
  let userProfile;
  if(message.mentions.members.first()) {
    user = message.mentions.members.first();
    userProfile = await mongoose.models.User.findOne({guildID: message.guild.id, userID: user.user.id});
    profile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: user.user.id});
  } else {
    user = message.author;
    userProfile = await mongoose.models.User.findOne({guildID: message.guild.id, userID: message.author.id});
    profile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});
  }



  let messagesAmount;
  if(!profile) {
      if(!userProfile) {
        userProfile = new mongoose.models.User({guildID: message.guild.id, userID: message.author.id, userTag: message.author.tag, messages: 0, Muted: false});
        console.log("Created profile for: " + message.author.tag)
        userProfile.messages += 1;
        await userProfile.save();

        messagesAmount = userProfile.messages;
      } messagesAmount = userProfile.messages;

      } else {
        messagesAmount = profile.messages.normalMessages;
  }


    const embed = new Discord.MessageEmbed()
    .setDescription(`➜ ${user}'s message amount: \`${messagesAmount}\``)
    .setColor(T.main)
    message.channel.send(embed) 


}
exports.help = {
  name: 'messages',
  aliases: ['m'],
}
