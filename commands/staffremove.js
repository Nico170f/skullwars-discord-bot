const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const moment = require("moment")
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');
exports.run = async (client, message, args) => {
  G.updateGuild();
  let m = message.guild.id;
  let g = settings.General.Servers;
  let Disabled = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription("Command invalid in this guild.")
  if(m != g.Public) return message.channel.send(Disabled);


  const warningChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.Warnings)
  const staffProfile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  });

  if(!settings.General.PermissionBypass.includes(message.author.id)){
  let notStaff = new Discord.MessageEmbed()
    .setDescription(`You are not a staff member!`)
    .setColor(T.red)
  if (!staffProfile) return message.channel.send(notStaff);

  let notHigh = new Discord.MessageEmbed()
    .setDescription(`Your staff ranking can't do remove staff!`)
    .setColor(T.red)
    if (staffProfile.rank < 7) return message.channel.send(notHigh)
  }



  let nostaff = new Discord.MessageEmbed()
  .setDescription(`Please mention someone to remove from the staff team!`)
  .setColor(T.main)
  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!user) return message.channel.send(nostaff);

  let profile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: user.user.id
  });
  if (!profile) {
    let embed38946 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription(`➜ <@!${user.user.id}> does not have a staff profile!`)
    return message.channel.send(embed38946)
  }
  let info;
  try {

    if (user.roles.cache.has(settings.Roles.Helper)) {
      const rr1 = message.guild.roles.cache.find(role => role.id === settings.Roles.Helper);
      user.roles.remove(rr1)
    }
    if (user.roles.cache.has(settings.Roles.Mod)) {
      const rr2 = message.guild.roles.cache.find(role => role.id === settings.Roles.Mod);
      user.roles.remove(rr2)
    }
    if (user.roles.cache.has(settings.Roles.SrMod)) {
      const rr3 = message.guild.roles.cache.find(role => role.id === settings.Roles.SrMod);
      user.roles.remove(rr3)
    }
    if (user.roles.cache.has(settings.Roles.JrAdmin)) {
      const rr4 = message.guild.roles.cache.find(role => role.id === settings.Roles.JrAdmin);
      user.roles.remove(rr4)
    }
    if (user.roles.cache.has(settings.Roles.Admin)) {
      const rr5 = message.guild.roles.cache.find(role => role.id === settings.Roles.Admin);
      user.roles.remove(rr5)
    }
    if (user.roles.cache.has(settings.Roles.SrAdmin)) {
      const rr6 = message.guild.roles.cache.find(role => role.id === settings.Roles.SrAdmin);
      user.roles.remove(rr6)
    }
    if (user.roles.cache.has(settings.Roles.Manager)) {
      const rr7 = message.guild.roles.cache.find(role => role.id === settings.Roles.Manager);
      user.roles.remove(rr7)
    }
    if (user.roles.cache.has(settings.Roles.Operator)) {
      const rr8 = message.guild.roles.cache.find(role => role.id === settings.Roles.Operator);
      user.roles.remove(rr8)
    }
    if (user.roles.cache.has(settings.Roles.Administration)) {
      const seniorR1 = message.guild.roles.cache.find(role => role.id === settings.Roles.Administration);
      user.roles.remove(seniorR1)
    }
    if (user.roles.cache.has(settings.Roles.Management)) {
      const management1 = message.guild.roles.cache.find(role => role.id === settings.Roles.Management);
      user.roles.remove(management1)
    }
    if (user.roles.cache.has(settings.Roles.Support)) {
      const supportRole = message.guild.roles.cache.find(role => role.id === settings.Roles.Support);
      user.roles.remove(supportRole)
    }

    info = `https://cravatar.eu/head/${profile.IGN}/100.png`
    await mongoose.models.Profile.deleteOne({
      guildID: message.guild.id,
      userID: user.user.id
    });
    user.setNickname(user.user.username)
  } catch {
    warningChannel.send(`@everyone \nThere was an error removing "<@!${user.user.id}>" from the staff team!\n\nThe error was either:\nRemoving the users roles.\nRemoving the user from the database. (Check .staff)`)
  }

  let StaffMovement = message.guild.channels.cache.find(c => c.id === settings.Channels.StaffMovement)
  let e2 = new Discord.MessageEmbed()
    .setColor(T.blank) //36393F
    .setAuthor(`Staff Member Removed!`, info)
    .setDescription(`<:Removed:823987984574971984> <@!${user.user.id}> has been removed from the Staff Team!`)
    .setFooter(`IGN: ${profile.IGN}`)
    .setTimestamp()

  let e69 = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription(`➜ <@!${user.user.id}> has been removed from the Staff Team!`)
  message.channel.send(e69)
  StaffMovement.send(e2);

  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription(`${message.author} removed <@!${user.user.id}> from the staff team. (${profile.IGN})`)
  modLogs.send(embed24)


  var s2 = `${profile.IGN}`
  let update2 = s2.length;
  let spacing2;

  if (update2 === 2) {
    spacing2 = `                        &7`
  } else if (update2 === 1) {
    spacing2 = `                         &7`
  } else if (update2 === 3) {
    spacing2 = `                       &7`
  } else if (update2 === 4) {
    spacing2 = `                       &7`
  } else if (update2 === 5) {
    spacing2 = `                       &7`
  } else if (update2 === 6) {
    spacing2 = `                      &7`
  } else if (update2 === 7) {
    spacing2 = `                     &7`
  } else if (update2 === 8) {
    spacing2 = `                     &7`
  } else if (update2 === 9) {
    spacing2 = `                    &7`
  } else if (update2 === 10) {
    spacing2 = `                   &7`
  } else if (update2 === 11) {
    spacing2 = `                   &7`
  } else if (update2 === 12) {
    spacing2 = `                  &7`
  } else if (update2 === 13) {
    spacing2 = `                 &7`
  } else if (update2 === 14) {
    spacing2 = `                &7`
  } else if (update2 === 15) {
    spacing2 = `                &7`
  } else if (update2 === 16) {
    spacing2 = `               &7`
  } else if (update2 > 16 || update2 < 2) {
    console.log("ERROR: IGN EITHER TOO LONG OR TOO SHORT")
    return;
  }


  let titlePart = `                       &4&lStaff Removed\n`
  let ignPart = `${spacing2}&7IGN: &f${profile.IGN}\n`
  let totalPart = `${titlePart}${ignPart}`


  if (settings.RCon.proxy.enabled) {
    const proxy = new Rcon({
      host: settings.RCon.proxy.host,
      port: settings.RCon.proxy.port,
      password: settings.RCon.proxy.pass
    })
    proxy.on("authenticated", () => console.log("authenticated"))
    proxy.on("connect", () => console.log("RCON has connected"))
    proxy.on("end", () => console.log("end"))
    try {
      await proxy.connect();
      proxy.send(`Announcer alert §`)
      await proxy.send(`Announcer alert §\n${totalPart}`) //${rank}
      await proxy.send(`Announcer alert §`)
      proxy.end()
      console.log("Sucessfully sent chat alert to proxy!")

    } catch (err) {
      console.log(err)
      console.log("There has been an error connecting to the proxy!")

      warningChannel.send(`@everyone\n\nWARNING | Error sending chat update to Proxy!\n`)
      await warningChannel.send(`\`\`\`diff\n+ ERROR INFO:\n- errno: ${err.errno}\n- code: ${err.code}\n- syscall: ${err.syscall}\`\`\``)
    }
  }
  if (settings.RCon.hub.enabled) {
    const hub = new Rcon({
      host: settings.RCon.hub.host,
      port: settings.RCon.hub.port,
      password: settings.RCon.hub.pass
    })
    hub.on("authenticated", () => console.log("authenticated"))
    hub.on("connect", () => console.log("RCON has connected"))
    hub.on("end", () => console.log("end"))
    try {

      await hub.connect();
      (await hub.send(`lp user ${profile.IGN} group set default`))
      hub.end()
      await mongoose.models.Profile.deleteOne({
        guildID: message.guild.id.toString(),
        userID: user.user.id.toString()
      });
      console.log("Sucessfully updated staff user ingame!")

    } catch (err) {
      console.log(err)
      console.log("There has been an error updating staff rank ingame!")

      warningChannel.send(`@everyone\n\nWARNING | ERROR ISSUING STAFF REMOVE\nUSER: ${user} \nIGN: \`${profile.IGN}\``)
      await warningChannel.send(`\`\`\`diff\n+ ERROR INFO:\n- errno: ${err.errno}\n- code: ${err.code}\n- syscall: ${err.syscall}\`\`\``)
    }
  }


}
exports.help = {
  name: 'staffremove',
  aliases: ['sremove', 'removestaff'],
}