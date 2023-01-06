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
  .addField("SkullWars | Buycaft", `➜ https://store.skullwars.net/`)
  .setColor(T.blank)
  message.channel.send(embed)


}
exports.help = {
  name: 'store',
  aliases: ['buycraft', "webshop"],
}
