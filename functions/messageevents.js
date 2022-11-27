const Discord = require('discord.js');
const settings = require('../settings.json');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const mongoose = require('../util/mongoose.js');
const moment = require('moment');
const T = settings.General.Theme;
const banned = require('../banned.json');
const ms = require("ms");


module.exports = (Client, message) => {

  let warningChannel;
  let lockedEmbed = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription(`We've detected spam in this Discord. \nEverything in this Discord has been locked down until further notice.`)
  let msgCounter = 0;
  Client.on('message', async message => {
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.guild.id != settings.General.Servers.Public) return;
    if (message.mentions.members.first()) {
      if (message.mentions.users.size > settings.GuildBotting.BotSpam.TagsInMessage - 1) {
        if (msgCounter === 0) {
          setTimeout(function () {
            if (msgCounter > settings.GuildBotting.BotSpam.messageLimit - 1) {

              let editrole = message.guild.roles.cache.find(r => r.id === settings.Roles.Member)
              editrole.setPermissions(editrole.permissions.remove('SEND_MESSAGES'))
              message.channel.send(lockedEmbed)
              warningChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.Warnings);
              warningChannel.send(`@everyone\n\nWARNING | Discord has been locked down!!\n\nToo many people were tagged within a short timeframe.`);
              msgCounter = 0;
            } else {
              msgCounter = 0;
            }
          }, ms(settings.GuildBotting.BotSpam.timer));
        }
        msgCounter++;
      }
    } else return;
  })

  let lockedEmbed1 = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription(`We've detected spam in this Discord. \nEverything in this Discord has been locked down until further notice.`)

  let msgCounter1 = 0;
  Client.on('message', async message => {
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.guild.id != settings.General.Servers.Public) return;
    if (message.mentions.members.first()) {
      if (message.mentions.users.size >= settings.GuildBotting.BotSpam.instaTagsInMessage) {
        if (msgCounter1 === 0) {
          setTimeout(function () {
            msgCounter1 = 0;
          }, ms(settings.GuildBotting.BotSpam.instaTimer));
          msgCounter1++;
          return;
        } else if (msgCounter1 >= settings.GuildBotting.BotSpam.instaMessageLimit - 1) {
          let editrole = message.guild.roles.cache.find(r => r.id === settings.Roles.Member)
          editrole.setPermissions(editrole.permissions.remove('SEND_MESSAGES'))

          //lockRole.setPermissions([lockPerms.locked])
          //message.guild.roles.everyone.setPermissions([lockPerms.locked]); //lockPerms.locked
          msgCounter1 = 0;
          message.channel.send(lockedEmbed1)
          warningChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.Warnings);
          warningChannel.send(`@everyone\n\nWARNING | Discord has been locked down!!\n\nToo many people were tagged within a short timeframe.`);
          return;
        }
        msgCounter1++;
      }
    }
  })













  Client.on('message', async message => {
    //console.log(message.guild.id)
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.guild.id != settings.General.Servers.Public) return;

    if (message.channel.name.includes("ticket-")) {
      let content = message.content
      if(content == ".close" && content == ".sclose") return;
      let author = message.author.tag
      let channels = message.channel.name //txt`,date +" in #"+ channels + " "+ author+ " ➤ "+ content+ "\n", function(err)
      fs.appendFile(`./ticketlogs/${channels}.txt`, author + " ➤ " + content + "\n", function (err) {
        if (err) {
          console.log(err)
        }
      });
    }

    let guild = await mongoose.models.Guild.findOne({
      guildID: message.guild.id
    });
    guild.stats.messages += 1;
    await guild.save();

    let count = 0;
    let remove = false;
    //console.log("message")
    if (!message.mentions.members.size == 0) {
      if(settings.General.PermissionBypass.includes(message.author.id)) return;
      let profile = await mongoose.models.Profile.findOne({
        guildID: message.guild.id,
        userID: message.author.id
      });
      if (!profile) {
        let messageUsers = message.mentions.members.map(el => el.user.id)
        let array = settings.General.TagBlockIDs;
        while (messageUsers.length > count) {
          if (count < array.length) {
            if (messageUsers.includes(settings.General.TagBlockIDs[count])) {
              if (!remove) {
                remove = true;
              }
            }
          }
          count++;
        }

        if (remove) {
          let content = message.content;
          let embed;
          if (message.channel.name.includes("ticket-")) {
            embed = new Discord.MessageEmbed()
              .setColor(T.red)
              .setDescription(`Please do not tag this user! Another staff member will be supporting you.`)
          } else {
            embed = new Discord.MessageEmbed()
              .setColor(T.red)
              .setDescription(`Please do not tag this user! If you need support please create a ticket in: <#${settings.Support.TicketChannelID}>`)
          }

          message.delete()
          message.channel.send(embed).then(msg => {
            msg.delete({
              timeout: 8000
            })
          })
          message.channel.send(`<@!${message.author.id}>`).then(msg => {
            msg.delete();
          })

          let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
          let embed24 = new Discord.MessageEmbed()
          .setColor(T.red)
          .setDescription(`Message by ${message.author} was automatically deleted, as the message tagged a blocked user.\n\n**Message Content:**\n${content}`)
          modLogs.send(embed24)
        }
      }
    }

    if (message.content.startsWith(settings.General.Prefix)) return;
    if (message.channel.name.includes("ticket-")) return; //{console.log("yes")}

    let date = moment(new Date()).format('DD-MMM-YYYY h:mm A')
    let content = message.content;
    let author = message.author.tag;
    let channels = message.channel.name; //txt`,date +" in #"+ channels + " "+ author+ " ➤ "+ content+ "\n", function(err)

    fs.appendFile(`./chatlog/global.txt`, date + " | " + author + " ➤ " + content + "\n", function (err) {
      if (err) {
        console.log(err)
      }
    });

    fs.appendFile(`./chatlog/${channels}.txt`, date + " | " + author + " ➤ " + content + "\n", function (err) {
      if (err) {
        console.log(err)
      }
    });
  })




  Client.on('message', async message => {
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.guild.id != settings.General.Servers.Public) return;
    if (message.content.startsWith(settings.General.Prefix)) return;

    let profile = await mongoose.models.Profile.findOne({
      guildID: message.guild.id,
      userID: message.author.id
    });
    if (!profile) {

      let userProfile = await mongoose.models.User.findOne({
        guildID: message.guild.id,
        userID: message.author.id
      });
      if (!userProfile) {
        userProfile = new mongoose.models.User({
          guildID: message.guild.id,
          userID: message.author.id,
          userTag: message.author.tag,
          messages: 0,
          Muted: false
        });

        userProfile.messages += 1;
        await userProfile.save();
      }
      userProfile.messages += 1;
      await userProfile.save();


    } else {


      if (message.channel.name.includes("ticket-")) {
        let ticketdata = await mongoose.models.Ticket.findOne({
          guildID: message.guild.id,
          channelID: message.channel.id
        });

        if (ticketdata) {
          if (message.author.id != ticketdata.userID) {
            profile.pointsTotal += settings.Points.ticketMessage;
            profile.pointsWeekly += settings.Points.ticketMessage;
            profile.pointsMonthly += settings.Points.ticketMessage;
            profile.messages.ticketMessages += 1;
          }
        }

      } else {
        profile.pointsTotal += settings.Points.message;
        profile.pointsWeekly += settings.Points.message;
        profile.pointsMonthly += settings.Points.message;
        profile.messages.normalMessages += 1;
      }
      await profile.save();
    }
  })



  Client.on('message', async message => {
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.guild.id != settings.General.Servers.Public) return;
    let staffProfile = await mongoose.models.Profile.findOne({
      guildID: message.guild.id,
      userID: message.author.id
    });
    if (staffProfile) return;

    const message2 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription(`Please don't send send that!`)

    const bannedwords = banned.words;
    for (var i = 0; i < bannedwords.length; i++)
      if (message.content.toLowerCase().includes(bannedwords[i])) { //return console.log("1");
        message.delete()
        message.channel.send(message2).then(msg => {
          msg.delete({
            timeout: 2000
          })
        })
        console.log("\x1b[31mBlocked word has been deleted!")
      }
  })




  Client.on('message', async message => {
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.guild.id != settings.General.Servers.Public) return;
    if (message.channel.name.includes("ticket-")) return;
    if (settings.General.DiscordLinksAllowed.includes(message.channel.id)) return;



    let staffProfile = await mongoose.models.Profile.findOne({
      guildID: message.guild.id,
      userID: message.author.id
    });
    if (staffProfile) return;

    const message1 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription(`Please don't send Discord Invite links!`)

    const bannedlinks = banned.links;
    for (var i = 0; i < bannedlinks.length; i++)
      if (message.content.toLowerCase().includes(bannedlinks[i])) { //return console.log("1");
        message.delete()
        message.channel.send(message1).then(msg => {
          msg.delete({
            timeout: 2000
          })
        })
        console.log("\x1b[31mBanned link has been deleted!")
        return;
      } else if (message.content.toLowerCase().includes("discord") && message.content.toLowerCase().includes("gg")) {
      message.delete()
      message.channel.send(message1).then(msg => {
        msg.delete({
          timeout: 2000
        })
      })
      console.log("\x1b[31mBanned link has been deleted!")
      return;
    }
  })


}