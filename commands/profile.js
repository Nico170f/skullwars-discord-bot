const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const axios = require('axios');
const G = require('../functions/cmdupdate.js');

exports.run = async (client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();

  let user;
  let state;
  if (message.mentions.members.first()) {
    user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    state = false;
  } else {
    user = message.guild.members.cache.get(message.author.id);
    state = true;
  }



  const embed3 = new Discord.MessageEmbed()
    .setDescription(`${user} does not have a staff profile!`)
    .setColor(T.red)

  const embed231432 = new Discord.MessageEmbed()
    .setDescription(`You don't have a staff profile!`)
    .setColor(T.red)

  let profile = await mongoose.models.Profile.findOne({
    guildID: settings.General.Servers.Public,
    userID: user.id
  });
  if (!profile) {
    if (!state) {
      return message.channel.send(embed3)
    } else {
      return message.channel.send(embed231432)
    }
  }



  const guild = message.guild;
  const member111 = guild.members.cache.find(member => member.id === user.id)

  let uuid;
  axios.get(`https://api.mojang.com/users/profiles/minecraft/${profile.IGN}`)
    .then(async (res) => {
      //console.log('RES:', res)
      //console.log('ID: ', res.data.id)

      uuid = res.data.id;

      //console.log(`${profile.dateAdded}`)
      //console.log(profile.dateAdded)
      //console.log(profile.IGN)

      function timeConvert(n) {
        if (n < 60) {
          return n + "m";
        } else {
          var hours = (n / 60);
          var rhours = Math.floor(hours);
          var minutes = (hours - rhours) * 60;
          var rminutes = Math.round(minutes);
          return rhours + "h, " + rminutes + "m";
        }
      }

      let info = `https://cravatar.eu/head/${profile.IGN}/300.png`
      let info2 = `https://crafatar.com/renders/body/${uuid}?size=400&default=MHF_Steve&overlay`
      const embed4 = new Discord.MessageEmbed()
        .setAuthor(`${member111.user.username}'s statistics:`, user.user.displayAvatarURL())
        .setColor(T.main)
        .setDescription(`Date added: \`${profile.dateAdded}\`\nStaff points: \`${profile.pointsTotal}\`\nIGN: \`${profile.IGN}\`\n`)
        //.addField('\u200b', '\u200b')
        .addField("Activity & Support:", `Voice Activity ➜ \`` + timeConvert(profile.moderation.activity) + `\`\nTickets closed ➜ \`${profile.moderation.tickets}\`\nTicket reponses ➜ \`${profile.messages.ticketMessages}\`\nMessages sent ➜ \`${profile.messages.normalMessages}\``)
        .addField("Moderation:", `Mutes ➜ \`${profile.moderation.mutes}\`\nKicks ➜ \`${profile.moderation.kicks}\`\nBans ➜ \`${profile.moderation.bans}\``)
        //.addField('\u200b', '\u200b')
        .setThumbnail(info2)
      //.setImage(info2, true)
      //.setTimestamp()
      //.setFooter("Skullwars")



      await message.channel.send(embed4)

    })
    .catch((err) => {
      console.error('ERR:', err)
    })





}
exports.help = {
  name: 'profile',
  aliases: ['profile'],
}