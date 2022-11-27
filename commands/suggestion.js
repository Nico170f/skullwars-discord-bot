const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require("../settings.json");
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async (client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();
  let m = message.guild.id;
  let g = settings.General.Servers;
  let Disabled = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription("Command invalid in this guild.")
  if(m != g.Public) return message.channel.send(Disabled);


  let userSuggestion = args.slice(0).join(" ");
  let user = message.author;

  let embed2 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription('Please specify your suggesiton!')
  if (args.length === 0) return message.channel.send(embed2)



  let newEmbed = new Discord.MessageEmbed()
    .setColor(T.blank)
    //.setAuthor(`${user.username}'s suggestion:`, `${user.defaultAvatarURL}`)
    .setDescription(`A new suggestion has been submitted! React \nbelow to vote.`)
    .addField("Submitter:", `${user.tag}`)
    .addField(`Suggestion:`, userSuggestion)
    .setThumbnail(message.author.displayAvatarURL())
    .setFooter("Skullwars")
    .setTimestamp();




  let sChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.Suggestions)
  let suggestMessage = await sChannel.send(newEmbed) //.then(msg => {
  suggestMessage.react("<:Promotion:823983645004922880>").then(() =>
  suggestMessage.react("<:Demotion:823983645245177876>")).then(() =>
  suggestMessage.react("<:Added:823987984155803649>")).catch(() => console.error('Failed to react.'));



  let schema = new mongoose.models.Suggest({
    guildID: message.guild.id,
    authorID: message.author.id,
    authorTAG: message.author.tag,
    messageID: suggestMessage.id.toString(),
    suggestion: userSuggestion,
    embedURL: message.author.displayAvatarURL()
  });
  await schema.save();



  let embed3 = new Discord.MessageEmbed()
    .setColor(T.green)
    .setDescription('Your suggestion has been submitted!')
  message.channel.send(embed3)


}
exports.help = {
  name: 'suggestion',
  aliases: ['suggest', 'idea'],
}