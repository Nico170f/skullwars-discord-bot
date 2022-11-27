const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const {
  Rcon
} = require('rcon-client');
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const moment = require("moment")
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


  const staffProfile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  });
  let date = moment(new Date()).format('DD-MMM-YYYY')
  let StaffMovement = message.guild.channels.cache.find(c => c.id === settings.Channels.StaffMovement) //36393F
  const warningChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.Warnings) //36393F
  const helperRole = message.guild.roles.cache.find(role => role.id === settings.Roles.Helper);

  if (!settings.General.PermissionBypass.includes(message.author.id)) {
    let notStaff = new Discord.MessageEmbed()
      .setDescription(`You are not a staff member!`)
      .setColor(T.red)
    if (!staffProfile) return message.channel.send(notStaff);

    let notHigh = new Discord.MessageEmbed()
      .setDescription(`Your staff ranking can't add users to the staff team!`)
      .setColor(T.red)
    if (staffProfile.rank < 7) return message.channel.send(notHigh)
  }


  let nostaff = new Discord.MessageEmbed()
    .setDescription(`Please mention a user to add to the staff team!`)
    .setColor(T.red)
  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!user) return message.channel.send(nostaff)


  let profile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: user.user.id
  });


  if (profile) {
    let embed3894 = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription(`➜ <@!${user.user.id}>'s staff profile already exists!`)
    return message.channel.send(embed3894)
  }

  let embed38 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("Please use the correct syntax: \`.staff add <@USER> <IGN>\`")
  if (!args[1]) return message.channel.send(embed38)


  profile = new mongoose.models.Profile({
    guildID: message.guild.id,
    userID: user.user.id,
    userTag: user.user.tag,
    IGN: args[1],
    dateAdded: date
  });
  await profile.save();

  let embed389 = new Discord.MessageEmbed()
    .setColor(T.green)
    .setDescription(`➜ <@!${user.user.id}> Sucessfully added to the staff team!`)
  message.channel.send(embed389)


  let info = `https://cravatar.eu/head/${args[1]}/100.png`
  let addEmbed = new Discord.MessageEmbed()
    .setColor("2f3136") //36393F
    .setAuthor(`Staff Added!`, info)
    .setDescription(`<:Added:823987984155803649> <@!${user.user.id}> has been added to the staff team!`)
    .setTimestamp()
    .setFooter(`IGN: ${args[1]}`)
  StaffMovement.send(addEmbed)

  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
  .setColor(T.red)
  .setDescription(`${message.author} added a new staff member.\n\nUser: <@!${user.user.id}>\nIGN: ${args[1]}`)
  modLogs.send(embed24)

  try {
    user.roles.add(helperRole).then(async () => {
      await user.setNickname(`[Helper] ${args[1]}`)
    })
  } catch (err) {
    console.log(err)
    message.channel.send("Error updating user")
  }

  let userProfile = await mongoose.models.User.findOne({
    guildID: message.guild.id,
    userID: user.user.id
  });
  if (userProfile) await mongoose.models.User.deleteOne({
    guildID: message.guild.id.toString(),
    userID: user.user.id
  });


  var s2 = `${args[1]}`
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
  }


  let titlePart = `                       &2&lStaff Added\n`
  let ignPart = `${spacing2}&7IGN: &f${args[1]}\n`
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
      (await hub.send(`lp user ${args[1]} group set helper`))
      hub.end()
      console.log("Sucessfully updated staff user ingame!")

    } catch (err) {
      console.log(err)
      console.log("There has been an error updating staff rank ingame!")

      warningChannel.send(`@everyone\n\nWARNING | ERROR ISSUING STAFF ADD\nUSER: ${user} \nIGN: \`${args[1]}\``)
      await warningChannel.send(`\`\`\`diff\n+ ERROR INFO:\n- errno: ${err.errno}\n- code: ${err.code}\n- syscall: ${err.syscall}\`\`\``)
    }
  }

}
exports.help = {
  name: 'staffadd',
  aliases: ['sadd'],
}