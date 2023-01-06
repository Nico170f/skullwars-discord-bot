const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async(client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();


  let embed = new Discord.MessageEmbed()
  .addField("SkullWars | Invite Link", `➜ https://discord.skullwars.net/`)
  .setColor(T.blank)
  message.channel.send(embed)


}
exports.help = {
  name: 'invite',
  aliases: ['invitelink', "inv"],
}
