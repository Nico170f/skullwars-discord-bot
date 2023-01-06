const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');
const mysql = require('mysql');


exports.run = async (client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();

  let m = message.guild.id;
  let g = settings.General.Servers;
  let Disabled = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription("Command invalid in this guild.")
  if (m != g.Public && m != g.Staff) return message.channel.send(Disabled);

  let cInfo = settings.Database.MySQL;
  var con = mysql.createConnection({
    host: cInfo.host,
    user: cInfo.user,
    password: cInfo.password,
    database: cInfo.database
  });
  var FacTable = cInfo.FactionTable;
  var BoostTable = cInfo.BoostTable;
  var FtopTable = cInfo.FTopTable;


  const staffProfile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  });
  if (!settings.General.PermissionBypass.includes(message.author.id)) {
    let notStaff = new Discord.MessageEmbed()
      .setDescription(`You're not a staff member!`)
      .setColor(T.red)
    if (!staffProfile) return message.channel.send(notStaff);

    let notHigh = new Discord.MessageEmbed()
      .setDescription(`You're not allowed to perform this command.`)
      .setColor(T.red)
    if (staffProfile.rank <= 7) return message.channel.send(notHigh)
  }

  let help = new Discord.MessageEmbed()
    .setAuthor(`Skullwars | Reset`, message.guild.iconURL())
    .setColor(T.main)
    .setDescription(`This is a list of data categories that can be reset using the bot. To reset one of the databases, please use: \`${settings.General.Prefix}reset <Category>\`. *All categories should generally be reset once every map.*`)
    //.addField("Setup:", `${prefix}help setup`)
    .addField("Categories:", `➜ FactionsTop\n➜ Signups\n➜ Boosters`)
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")

  let timeout = new Discord.MessageEmbed()
    .setDescription("Request timed out.");
  let cancel = new Discord.MessageEmbed()
    .setDescription("Incorrect code.");
  let code = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  if (!args[0]) return message.channel.send(help);
  if (args[0].toLowerCase() === "help") {
    message.channel.send(help)
  } else if (args[0].toLowerCase() === "factionstop") {
    let accept = new Discord.MessageEmbed()
      .setDescription(`Are you sure you want to delete FactionsTop Data?\nPlease reply with the following code to execute database reset: \`${code}\``)
      .setColor(T.red);
    let filter = m => m.author.id === message.author.id;
    message.channel.send(accept).then(() => {
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          if (message.content == code) {
            con.connect(async function (err) {
              try {
                con.query(`DELETE FROM ${FtopTable}`, async function (err, result, rows) {
                  let completed = new Discord.MessageEmbed()
                    .setDescription(`Successfully reset FactionsTop Data!`)
                    .setColor(T.green)
                    con.end();
                  return message.channel.send(completed);
                })
              } catch (err) {
                console.log(err)
                return message.channel.send("An error has occured.")
              }
            })
          } else {
            return message.channel.send(cancel);
          }
        })
        .catch(collected => {
          return message.channel.send(timeout);
        });
    })

  } else if (args[0].toLowerCase() === "signups") {

    let accept = new Discord.MessageEmbed()
      .setDescription(`Are you sure you want to delete Faction Signup Data?\nPlease reply with the following code to execute database reset: \`${code}\``)
      .setColor(T.red);
    let filter = m => m.author.id === message.author.id;
    message.channel.send(accept).then(() => {
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          if (message.content == code) {
            con.connect(async function (err) {
              try {
                con.query(`DELETE FROM ${FacTable}`, async function (err, result, rows) {

                      let link;
                      if (!settings.FactionSignup.ReleaseCountdown.includes("https://")) {
                        link = "";
                      } else {
                        link = `[Release Countdown](${settings.FactionSignup.ReleaseCountdown})`
                      }

                      let Updated = new Discord.MessageEmbed()
                        .setTitle("Factions Playing Zanak", message.guild.iconURL())
                        .setDescription(`Below are the current Factions who has signed up \nfor ${settings.General.Zanak.CurrentMap}! ${link}\n\nTotal Faction Signups: \`0\``)
                        .addField("Faction", `No signups.`, true)
                        .addField("Owner", `No signups.`, true)
                        //.addField("IGN", `${ownerIGN}`, true)
                        .addField("Bundle", `Redeem the bundle in-game using the\n\`/fbundle\` command. *Sign up through tickets to receive a bundle for free!*`)
                        .setColor(T.blank)
                      //.setImage(settings.Factions.DisplayGif)

                      const updateChannel = client.channels.cache.get(settings.FactionSignup.FactionsChannel);
                      updateChannel.messages.fetch(settings.FactionSignup.FactionsMessage).then(msg => {
                        msg.edit(Updated)
                      })
                      con.end();
                      let completed = new Discord.MessageEmbed()
                      .setDescription(`Successfully reset both ${updateChannel} & the Database.`)
                      .setColor(T.green)
                      return message.channel.send(completed);

                })
              } catch (err) {
                console.log(err)
                return message.channel.send("An error has occured.")
              }
            })
          } else {
            return message.channel.send(cancel);
          }
        })
        .catch(collected => {
          return message.channel.send(timeout);
        });
    })

  } else if (args[0].toLowerCase() === "boosters") {
    let accept = new Discord.MessageEmbed()
      .setDescription(`Are you sure you want to delete FactionsTop Data?\nPlease reply with the following code to execute database reset: \`${code}\``)
      .setColor(T.red);
    let filter = m => m.author.id === message.author.id;
    message.channel.send(accept).then(() => {
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          if (message.content == code) {
            con.connect(async function (err) {
              try {
                con.query(`DELETE FROM ${BoostTable}`, async function (err, result, rows) {
                  con.end();
                  let completed = new Discord.MessageEmbed()
                    .setDescription(`Successfully reset all Boosters! They are now able to \`.Boost claim\` once again.`)
                    .setColor(T.green)
                  return message.channel.send(completed);
                })
              } catch (err) {
                console.log(err)
                return message.channel.send("An error has occured.")
              }
            })
          } else {
            return message.channel.send(cancel);
          }
        })
        .catch(collected => {
          return message.channel.send(timeout);
        });
    })

  } else {
    message.channel.send(help);
  }

}
exports.help = {
  name: 'reset',
  aliases: ['db'],
}