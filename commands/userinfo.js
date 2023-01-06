const Discord = require("discord.js")
const moment = require("moment");
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

  let user;
  let profile;
  let userProfile;
  if (message.mentions.members.first()) {
    user = message.mentions.members.first().user;
    //user = message.guild.cache.find(member => member.id === message.mentions.members.first().id)
    userProfile = await mongoose.models.User.findOne({
      guildID: message.guild.id,
      userID: user.id
    });
    profile = await mongoose.models.Profile.findOne({
      guildID: message.guild.id,
      userID: user.id
    });
  } else {
    user = message.author;
    userProfile = await mongoose.models.User.findOne({
      guildID: message.guild.id,
      userID: message.author.id
    });
    profile = await mongoose.models.Profile.findOne({
      guildID: message.guild.id,
      userID: message.author.id
    });
  }

  let messages;
  let type = "Member";
  let muted = "false";
  if (profile) {
    type = "Staff";
    messages = profile.messages.normalMessages + profile.messages.ticketMessages;
  } else {
    if(user.bot){
      type = "Bot";
    }
    if (userProfile) {
      messages = userProfile.messages;
      if (userProfile.Muted == true) {
        muted = "true"
      }
    } else {
      messages = "0";
    }

  }


  const guild = message.guild;
  const member111 = guild.members.cache.find(member => member.id === user.id)


  const member = message.guild.member(user);
  const embed = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setAuthor(`${member111.user.username}'s information:`, user.displayAvatarURL())
    .setDescription(`Type: \`${type}\`\nMessages: \`${messages}\`\nMuted: \`${muted}\``)
    .addField("User:", `➜ Join position: *${getJoinRank(user.id, message.guild)}*\n➜ Tag: *${user.tag}*\n➜ ID: *${user.id}*\n➜ Joined date: \`${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}\`\n➜ Creation date: \`${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}\``)
    .setThumbnail(user.displayAvatarURL())
  message.channel.send({
    embed
  });



  function getJoinRank(ID, guild) { // Call it with the ID of the user and the guild
    if (!guild.member(ID)) return; // It will return undefined if the ID is not valid

    let arr = guild.members.cache.array(); // Create an array with every member
    arr.sort((a, b) => a.joinedAt - b.joinedAt); // Sort them by join date

    for (let i = 0; i < arr.length; i++) { // Loop though every element
      if (arr[i].id == ID) return i + 1; // When you find the user, return it's position
    }
}


}
exports.help = {
  name: 'userinfo',
  aliases: ['ui'],
}