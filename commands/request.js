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

  const staffProfile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: message.author.id});
  let embed1 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription("You don't have permission to use this command!")
  if(!staffProfile) return message.channel.send(embed1);
  
  fs.readdir("./chatlog/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file, i) => {
      if (!file.endsWith(".txt")) return;
      let cmdFileName = file.split(".")[0];
      //console.log(`\u001b[0m${i + 1}. ${cmdFileName} found.`);
    });
    if(!args[0]) {
    const embed1 = new Discord.MessageEmbed()
      .setAuthor(`Skullwars | Chat-logging`)
      .setColor(T.main)
      .setDescription("This is a list of avaliable chat logs.\nRequest chatlogs using \`.request <file.txt>\`")
      .addField("Avaliable files:", files.map((logs, i) => `**${i+1}.** ${logs}`))
      .setFooter("Skullwars")
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      message.channel.send(embed1)

    } else {
      const path = `./chatlog/${args[0]}`
      try {
        if (fs.existsSync(path)) {
          
      const embed2 = new Discord.MessageEmbed()
      .setColor(T.green)
      .setDescription(`File: \`${args[0]}\` will now be sent, check your DMs!`)
      message.channel.send(embed2)
      message.author.send({files: [path]})

      let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
      let embed24 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription(`${message.author} requested the chatlog ${args[0]}.`)
      modLogs.send(embed24)
        } else {

      const embed3 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription(`File: \`${args[0]}\` was not found!`)
      message.channel.send(embed3)
        }
      } catch(err) {
        console.error(err)
      }
  }});

}
exports.help = {
  name: 'request',
  aliases: ['chatlog'],
}
