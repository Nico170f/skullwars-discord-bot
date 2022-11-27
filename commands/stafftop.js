const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const moment = require('moment');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');
const prefix = settings.General.Prefix;
exports.run = async (client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();

  let data = await mongoose.getGuild(settings.General.Servers.Public);
  const datenow = moment(new Date()).format('DD-MMM')
  let date;

  if (args[0] === "weekly") {
    date = data.weekDate;
  } else if (args[0] === "monthly") {
    date = data.monthDate;
  }


  let alltimeusers = await mongoose.models.Profile.find({
    guildID: settings.General.Servers.Public
  }).select("userID pointsTotal -_id").sort({
    pointsTotal: -1
  }).limit(20)
  let alltime = new Discord.MessageEmbed()
    .setAuthor("Staff-Top Ranking | All time", message.guild.iconURL())
    .setDescription(`This leaderboard displays highest to lowest \nranked staffs by points!`)
    .addField("Ranking:", alltimeusers.map((user, index) => `#${index+1} - points: \`${user.pointsTotal}\` - <@!${user.userID}>`))
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")
    .setColor(T.main)
    .setTimestamp()
    .setFooter("Skullwars")
  //console.log(alltimeusers.map((user, index) =>  `#${index+1} - points: \`${user.points}\` - <@!${user.userID}>`));

  let monthlyusers = await mongoose.models.Profile.find({
    guildID: settings.General.Servers.Public
  }).select("userID pointsMonthly -_id").sort({
    pointsMonthly: -1
  }).limit(20)
  let monthly = new Discord.MessageEmbed()
    .setAuthor("Staff-Top Ranking | Monthly", message.guild.iconURL())
    .setDescription(`This leaderboard displays highest to lowest \nranked staffs in the current __month__! \n\nTime period:\n\`${date}\` ➜ \`${datenow}\``)
    .addField("Ranking:", monthlyusers.map((user, index) => `#${index+1} - points: \`${user.pointsMonthly}\` - <@!${user.userID}>`))
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656401881399296/SkullWars_Tickets_Sword.png")
    .setColor(T.main)
    .setTimestamp()
    .setFooter("Skullwars")

  let weeklyusers = await mongoose.models.Profile.find({
    guildID: settings.General.Servers.Public
  }).select("userID pointsWeekly -_id").sort({
    pointsWeekly: -1
  }).limit(20)
  let weekly = new Discord.MessageEmbed()
    .setAuthor("Staff-Top Ranking | Weekly", message.guild.iconURL())
    .setDescription(`This leaderboard displays highest to lowest \nranked staffs in the current __week__! \n\nTime period:\n\`${date}\` ➜ \`${datenow}\``)
    .addField("Ranking:", weeklyusers.map((user, index) => `#${index+1} - points: \`${user.pointsWeekly}\` - <@!${user.userID}>`))
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656401881399296/SkullWars_Tickets_Sword.png")
    .setColor(T.main)
    .setTimestamp()
    .setFooter("Skullwars")

  let help = new Discord.MessageEmbed()
    .setAuthor(`Skullwars | Stafftop`, message.guild.iconURL())
    .setColor(T.main)
    .setDescription("This is a list of avaliable stafftop categories. Data from weekly and monthly is regularly reset.")
    //.addField("Setup:", `${prefix}help setup`)
    .addField("Categories:", `Weekly ➜ \`${prefix}stafftop weekly\`\nMonthly ➜ \`${prefix}stafftop monthly\`\nAlltime ➜ \`${prefix}stafftop alltime\`\n`)
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")


  if (!args[0]) return message.channel.send(help);
  if (args[0].toLowerCase() === "weekly") {
    message.channel.send(weekly)
  } else if (args[0].toLowerCase() === "monthly") {
    message.channel.send(monthly);
  } else if (args[0].toLowerCase() === "alltime") {
    message.channel.send(alltime);
  } else {
    message.channel.send(help);
  }

}
exports.help = {
  name: 'stafftop',
  aliases: ['st'],
}