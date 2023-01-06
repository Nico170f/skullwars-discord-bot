const Discord = require("discord.js")
const settings =  require("../settings.json");
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
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

  const staffProfile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});
  var NumbersToDelete = args[0];
  if (NumbersToDelete > 100) NumbersToDelete = 100;

  if(!settings.General.PermissionBypass.includes(message.author.id)){
  let notStaff = new Discord.MessageEmbed()
  .setDescription(`You are not a staff member!`)
  .setColor(T.red)
  if(!staffProfile) return message.channel.send(notStaff);
}
  
  let embed1 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("You must specify a number of messages to delete!")
  if (!args[0]) return message.channel.send(embed1);

  let embed2 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("Please provide a number that's higher than 1.")
  if (NumbersToDelete <= 0 ) return message.channel.send(embed2);

  let embed3 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("Please provide an ammount of messages to delete!")
  if (isNaN(args[0])) return message.channel.send(embed3);


  message.delete()

const fetch = await message.channel.messages.fetch({ limit: NumbersToDelete });
if(!fetch) console.log("e")


  message.channel.bulkDelete(NumbersToDelete, true).then(() => {

    let embed4 = new Discord.MessageEmbed()
    .setColor(T.green)
    .setDescription(`Deleted ${args[0]} messages!`  )
    message.channel.send(embed4);
})




let embed123 = new Discord.MessageEmbed()
.setColor(T.orange)
.setDescription("A channel has been __purged!__")
.addField("Moderator:", `<@!${message.author.id}>\n(${message.author.id})`, true)
.addField("Channel:", `\`${message.channel.name}\`\n(${message.channel.id})`, true)
.addField("#:", NumbersToDelete)
.setThumbnail(message.guild.iconURL()) 
//.setThumbnail(cfg[message.guild.id].thumbnail)
let sChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
sChannel.send(embed123)
 
}
exports.help = {
  name: 'purge',
  aliases: ['p'],
}
