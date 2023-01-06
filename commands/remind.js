const Discord = require('discord.js');
const settings = require('../settings.json');
const mongoose = require('../util/mongoose.js');
const ms = require("ms");
const fs = require("fs");
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');
exports.run = async(client, message, args) => { //eslint-no-unused-vars
G.updateGuild();



    const staffProfile = await mongoose.models.Profile.findOne({guildID: settings.General.Servers.Public, userID: message.author.id});
    let reminderTime = args[0];
    let channelinfo;

    if(!settings.General.PermissionBypass.includes(message.author.id)){
    let notStaff = new Discord.MessageEmbed()
    .setDescription(`You are not a staff member!`)
    .setColor(T.red)
    if(!staffProfile) return message.channel.send(notStaff);
    }
    
    let embed2 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("Correct syntax ➜ `.remind <1min> <here/dm> <message>`")
    if(!reminderTime) return message.channel.send(embed2);

    let embed2564 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`Correct syntax ➜ \`.remind ${reminderTime} <here/dm> <message>\``)
    if(!args[1]) return message.channel.send(embed2564);


    if(args[1].toLowerCase() === "here") {
      channelinfo = message.channel
    } else if(args[1].toLowerCase() === "dm") {
      channelinfo = message.guild.members.cache.get(message.author.id)
    } else {
      return message.channel.send(embed2564);
    }

    let reminder = args.slice(2).join(" ");
    let embed25642 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`Correct syntax ➜ \`.remind ${reminderTime} ${args[1]} <message>\``)
    if(!reminder) return message.channel.send(embed25642)




    let remindEmbed = new Discord.MessageEmbed()
        .setColor(T.main)
        .setDescription(`Reminder created!`)
        //.setFooter(botconfig.madeby, cfg[message.guild.id].logo)
        //.setThumbnail(cfg[message.guild.id].thumbnail)
        message.channel.send(remindEmbed);

        let remindString;
      if(reminderTime.includes("s")){
        remindString = `${reminderTime}`.replace("s", " seconds");
      } else if(reminderTime.includes("m")){
        remindString = `${reminderTime}`.replace("m", " minutes");
      } else if(reminderTime.includes("h")){
        remindString = `${reminderTime}`.replace("h", " hours");
      } else if(reminderTime.includes("d")){
        remindString = `${reminderTime}`.replace("d", " days");
      }

      setTimeout(function() {
        let remindEmbed = new Discord.MessageEmbed()
        .setColor(T.blank)//#e1ac00
        .setAuthor("Reminder", message.guild.iconURL())
        .setDescription(`Reminder for <@!${message.author.id}> has ended after \`${remindString}\`!`)
        .addField("Reminder message:", reminder)
        channelinfo.send(`${message.author}`).then(m => m.delete())
        channelinfo.send(remindEmbed);
  }, ms(reminderTime));



}
exports.help = {
  name: 'remind',
  aliases: ['re'],
}
