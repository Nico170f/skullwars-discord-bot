const mongoose = require('../util/mongoose.js');
const Discord = require('discord.js');
const settings = require('../settings.json');
const ms = require("ms");
const T = settings.General.Theme;

let amount = 0;
module.exports = async (client, member) => {
  if (member.guild.id != settings.General.Servers.Public) return;
  let role = member.guild.roles.cache.find(role => role.id === settings.Roles.Member);
  member.roles.add(role);


  if (await mongoose.models.User.exists({
      guildID: member.guild.id.toString(),
      userID: member.id.toString(),
      Muted: true
    })) {
    member.roles.add(settings.Roles.Muted)
    console.log(`\x1b[31mMuted user: "` + member.user.tag + `" rejoined the guild and was automatically muted!\x1b[32m`)
  }


  const warningChannel = member.guild.channels.cache.find(c => c.id === settings.Channels.Warnings) //36393F  
  if (amount === 0) {
    setTimeout(function () {
      if (amount > settings.GuildBotting.BotJoins.limit - 1) {
        let timer = (settings.GuildBotting.BotJoins.timer).replace("s", "");
        warningChannel.send(`@everyone\n\nWARNING | POSSIBLE BOT ATTACK\n\`${amount}\` users joined within \`${timer}\` seconds!`)
        amount = 0;
      } else {
        amount = 0;
      }
    }, ms(settings.GuildBotting.BotJoins.timer));
  }
  amount++;



  let test = new Discord.MessageEmbed()
  .setDescription(`Welcome to SkullWars <@!${member.user.id}>!\n\n**Information:**\n<:Online:727949353184133172> **IP:** \`play.skullwars.net\`\n:shopping_cart:  **Store:** https://store.skullwars.net/`)
  .setFooter(member.guild.members.cache.filter(member => !member.user.bot).size)
  .setColor(T.blank)
  .setTimestamp()
  .setThumbnail(member.user.displayAvatarURL()) 
  let welcomemsg = member.guild.channels.cache.find(c => c.id === settings.Channels.Welcome);
  welcomemsg.send({
    embed: test
  });


  const logembed = new Discord.MessageEmbed()
    .setColor(T.green)
    .setDescription(`${member.user.tag} (*${member.user.id}*)`)
    .setFooter("Member count: " + member.guild.memberCount)
  let logmsg = member.guild.channels.cache.find(c => c.id === settings.Channels.MemberLog);
  logmsg.send({
    embed: logembed
  });

  let uniqueUsers = await mongoose.models.Guild.findOne({
    guildID: member.guild.id
  });
  if (!uniqueUsers) {
    uniqueUsers = new mongoose.models.Guild({
      guildID: member.guild.id,
    });
    await uniqueUsers.save();
  }


  if (uniqueUsers.uniqueJoins.includes(member.id)) return; //console.log("Already added!")
  uniqueUsers.uniqueJoins.push(member.id)
  await uniqueUsers.save();
};