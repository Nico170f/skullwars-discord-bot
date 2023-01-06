const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const { Rcon } = require('rcon-client');
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const moment = require("moment")
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');
exports.run = async(client, message, args) => { //eslint-no-unused-vars  
G.updateGuild();



  let alltimeusers = await mongoose.models.Profile.find({guildID: settings.General.Servers.Public}).select("userID rank IGN -_id").sort({rank: -1})
  let Position = alltimeusers.map((user, index) => `${user.rank}`.replace("9", "Owner").replace("8", "Operator").replace("7", "Manager").replace("6", "Sr. Admin").replace("5", "Admin").replace("4", "Jr. Admin").replace("3", "Sr. Mod").replace("2", "Mod").replace("1", "Helper").replace("undefined", "<Not found>"));
  

  let noexist = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription(`No staff members were found in the database!`)
  let exist = await mongoose.models.Profile.findOne({guildID: settings.General.Servers.Public});
  if(!exist) return message.channel.send(noexist)


  let stafflist = new Discord.MessageEmbed()
  .setAuthor("Staff | SkullWars", message.guild.iconURL())
  .setDescription(`Showing staff list from highest to lowest ranked. \nSub commands: \`remove\`, \`ign\`, \`add\``)
  .addField("List:", alltimeusers.map((user, index) => `➜ <@!${user.userID}>`), true)
  .addField("Position:", Position, true)
  //.addField("IGN:", alltimeusers.map((user, index) => `${user.IGN}`.replace("undefined", "<Not found>")), true)
  .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")
  .setColor(T.main)
   return message.channel.send(stafflist)

}
exports.help = {
  name: 'staff',
  aliases: ['st'],
}
