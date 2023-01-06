const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');
exports.run = async(client, message, args) => { //eslint-no-unused-vars
G.updateGuild();




//let timer;
//if(settings.release.zanak.year === "") {
//  timer = "Release date has not been set!"
//} else {
//let d = settings.release.zanak;
//timer = countdown( new Date( d.year, d.month, d.date1, d.hour)).toString()
//}
//console.log(timer)



let releasedate;
if(settings.General.Zanak.date === "") {
  releasedate = "Release date has not been set!"

} else {


var countDownDate = new Date(settings.General.Zanak.date).getTime();
var now = new Date().getTime();
var distance = countDownDate - now;


var days = Math.floor(distance / (1000 * 60 * 60 * 24));
var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
var seconds = Math.floor((distance % (1000 * 60)) / 1000);

releasedate = days + " days, " + hours + " hours & " + minutes + " minutes!";
}


//let d = settings.release.zanak;
//timer = countdown( new Date( d.year, d.month, d.date1, d.hour)).toString()




  if(releasedate.includes("-")) releasedate = "Map has ended."



  let weekly = new Discord.MessageEmbed()
  .setAuthor("Release Dates | SkullWars", message.guild.iconURL())
  .setDescription(`This list displays servers on the SkullWars network.`)
  .addField("Servers:", `Zanak ➜ \`${settings.General.Prefix}release Zanak\``)
  .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")
  .setColor(T.main)
  .setTimestamp()
  .setFooter("Skullwars")

  let zanak = new Discord.MessageEmbed()
  .setAuthor("Release | Zanak", message.guild.iconURL())
  .setDescription(`Showing __Zanak__ release date:`)
  .addField("Release date:", `Zanak release ➜ \`${releasedate}\``)
  .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")
  .setColor(T.main)
  .setTimestamp()
  .setFooter("Skullwars")

  if(!args[0]) return message.channel.send(weekly);
  if(args[0].toLowerCase() === "zanak") message.channel.send(zanak);


}
exports.help = {
  name: 'release',
  aliases: ['r'],
}
