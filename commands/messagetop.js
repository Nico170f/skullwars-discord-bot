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
  let prefix = settings.General.Prefix;
  let base = new Discord.MessageEmbed()
    .setAuthor(`Skullwars | Stafftop`, message.guild.iconURL)
    .setColor(T.main)
    .setDescription("This is a list of avaliable messagetop categories.")
    .addField("Categories:", `Staff ➜ \`${prefix}messagetop staff\`\nMembers ➜ \`${prefix}messagetop members\`\n`)
    .setThumbnail(message.guild.iconURL())

    let staffUsers = await mongoose.models.Profile.find({guildID: message.guild.id}).select("userID messages.normalMessages -_id").sort({
      "messages.normalMessages": -1
    }).limit(20)

    let staffMsg = new Discord.MessageEmbed()
    .setAuthor("Message-Top Staff", message.guild.iconURL())
    .setDescription(`This leaderboard displays what Staff sent the \nmost messages in this Discord.! Staff messages are are not counted from tickets.`)
    .addField("Users:", staffUsers.map((user, index) => `#${index+1} - <@!${user.userID}>`), true)
    .addField("Messages:", staffUsers.map((user, index) => `${user.messages.normalMessages}`), true)
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")
    .setColor(T.main)
    .setTimestamp()
    .setFooter("Skullwars")


    let normalUsers = await mongoose.models.User.find({guildID: message.guild.id}).select("userID messages -_id").sort({
      messages: -1
    }).limit(20)
    let normalMsg = new Discord.MessageEmbed()
    .setAuthor("Message-Top Members", message.guild.iconURL())
    .setDescription(`This leaderboard displays what members sent the\n most messages in this Discord!`)
    .addField("Users:", normalUsers.map((user, index) => `#${index+1} - <@!${user.userID}>`), true)
    .addField("Messages:", normalUsers.map((user, index) => `${user.messages}`), true)
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656401881399296/SkullWars_Tickets_Sword.png")
    .setColor(T.main)
    .setTimestamp()
    .setFooter("Skullwars")


    if (!args[0]) return message.channel.send(base);
    if (args[0].toLowerCase() === "staff") {
      message.channel.send(staffMsg)
    } else if (args[0].toLowerCase() === "members") {
      message.channel.send(normalMsg);
    } else {
      message.channel.send(base);
    }

}
exports.help = {
  name: 'messagetop',
  aliases: ['msgtop'],
}
