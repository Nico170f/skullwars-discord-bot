const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings =  require("../settings.json");
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');
exports.run = async(client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();



  function duration(ms) {
  const sec = Math.floor((ms / 1000) % 60).toString();
  const min = Math.floor((ms / (1000 * 60)) % 60).toString();
  const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString();
  const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
  return `${days.padStart(1, "0")} days, ${hrs.padStart(1, "0")} hours, ${min.padStart(1, "0")} minutes, ${sec.padStart(1, "0")} seconds`;
  }

  let embed = new Discord.MessageEmbed()
  .setColor(T.main)
  .setDescription(`${duration(client.uptime)}`);
  message.channel.send(embed);
  


}
exports.help = {
  name: 'uptime',
  aliases: ['ut'],
}
