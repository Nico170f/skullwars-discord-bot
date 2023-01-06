const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const mysql = require('mysql');
const {
  onPossiblyUnhandledRejection
} = require("bluebird");
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

  let cInfo = settings.Database.MySQL;
  var con = mysql.createConnection({
    host: cInfo.host,
    user: cInfo.user,
    password: cInfo.password,
    database: cInfo.database
  });
  var table = cInfo.BoostTable;


  let p = settings.General.Prefix;
  if (!args[0] || (args[0].toLowerCase() != "claim" && args[0].toLowerCase() != "rewards" && args[0].toLowerCase() != "gen")) {
    let avaliable = new Discord.MessageEmbed()
      .setTitle("Server Boosting")
      .setDescription(`Avaliable subcommands are shown below:\n\n**Boosting Commands:**\n➜ ${p}boost claim\n➜ ${p}boost rewards\n➜ ${p}boost gen`)
      .setColor("#f47fff")
      .setThumbnail("https://media.discordapp.net/attachments/608279073831256074/873561704229896192/pngaaa.com-5186301.png")
    return message.channel.send(avaliable)
  } else if (args[0].toLowerCase() === "claim") {

    let user = message.member;
    if (user.roles.cache.has(settings.Roles.Booster)) { //#f47fff
      let errorm = new Discord.MessageEmbed()
        .setDescription(`Something went wrong...`)
        .setColor("#f47fff")

      let alreadySigned = new Discord.MessageEmbed()
        .setDescription(`We're sorry but... You're only able to claim this bundle once every map!`)
        .setColor("#f47fff")

      con.connect(async function (err) {


        con.query(`SELECT * FROM ${table}`, async function (err, result, rows) {

          try {
            for (var i = 0; i < result.length; i++) {
              if (result[i].id.toLowerCase() === message.author.id) {
                return message.channel.send(alreadySigned);
              }
            }


            try {
              let code = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
              con.query(`INSERT INTO \`${table}\` (\`id\`, \`code\`, \`claimed\`) VALUES ('${message.author.id}', '${code}', '0')`, async function (err, result, rows) {
                if (err) {
                  console.log(err)
                }
                con.end();
              })

              let dmMessage = new Discord.MessageEmbed()
                .setTitle("Thank you for boosting!")
                .setDescription(`While on Zanak please enter the following \ncommand: \`/boost ${code}\``)
                .setThumbnail("https://media.discordapp.net/attachments/608279073831256074/873561704229896192/pngaaa.com-5186301.png")
                .setColor(T.boost)

              try {
                message.author.send(dmMessage)
              } catch (error) {
                console.log("Could not DM user boosing code.")
                return message.channel.send("Hmm... Seems like there was an issue sending your code to your DM's, please create a ticket!");
              }


              let Boosting = new Discord.MessageEmbed()
                .setTitle("Thank you!")
                .setDescription(`Thank you so much for boosting! You've been DM'ed a redeemable code!`)
                .addField("Claiming:", `The code you've been DMed can be used to claim your boosting bundle ingame! In order to do this, please enter the following command while on Zanak: \`/boost <CODE>\``)
                .setThumbnail("https://media.discordapp.net/attachments/608279073831256074/873561704229896192/pngaaa.com-5186301.png")
                .setColor(T.boost)
              return message.channel.send(Boosting)
            } catch (error) {
              console.log(error)
              return message.channel.send(errorm)
            }
          } catch (error) {
            console.log(error)
            return message.channel.send(errorm)
          }
        })
      })
    } else {
      let NotBoosting = new Discord.MessageEmbed()
        .setDescription(`Hmm, it does not seem like you're boosting... \nPlease create a ticket if this is incorrect.`)
        .setColor(T.blank) //"#f47fff"
      return message.channel.send(NotBoosting)
    }
  } else if (args[0].toLowerCase() === "rewards") {

    let rewards = new Discord.MessageEmbed()
      .setTitle("Server Boosting")
      .setDescription(settings.ServerBoosting.Rewards)
      //.setImage(settings.Boosting.RewardsGif)
      .setColor(T.boost) //"#f47fff"
      .setThumbnail("https://media.discordapp.net/attachments/608279073831256074/873561704229896192/pngaaa.com-5186301.png")
    message.channel.send(rewards)
    return message.channel.send({
      files: [`././media/BoostingBundle.mp4`]
    })

  } else if (args[0].toLowerCase() === "gen") {
    let profile = await mongoose.models.Profile.findOne({
      guildID: message.guild.id,
      userID: message.author.id
    });
    let notStaff = new Discord.MessageEmbed()
      .setDescription(`You're not a staff member.`)
      .setColor(T.blank)
    if (!profile) return message.channel.send(notStaff);

    let notHigh = new Discord.MessageEmbed()
      .setDescription(`Your current ranking does not allow this.`)
      .setColor(T.blank)
    if (profile.rank < 4) return message.channel.send(notHigh)


    con.connect(async function (err) {
      con.query(`SELECT * FROM ${table}`, async function (err, result, rows) {

        try {
          let code = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
          con.query(`INSERT INTO \`${table}\` (\`id\`, \`code\`, \`claimed\`) VALUES ('${message.author.id}', '${code}', '0')`, async function (err, result, rows) {
            if (err) {
              console.log(err)
            }
            con.end();
          })
          let dmMessage = new Discord.MessageEmbed()
          .setTitle("Code Generated!")
          .setDescription(`The code generated for you is: \`${code}\`\nThis code can be claimed by issuing \`/boost ${code}\` ingame.`)
          .setThumbnail("https://media.discordapp.net/attachments/608279073831256074/873561704229896192/pngaaa.com-5186301.png")
          .setColor(T.boost)
          message.author.send(dmMessage)

          let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
          let embed24 = new Discord.MessageEmbed()
          .setColor(T.boost)
          .setDescription(`${message.author} generated a boosting code. (\`${code}\`)`)
          modLogs.send(embed24)

          let Boosting = new Discord.MessageEmbed()
            .setDescription(`You've been DM'ed!`)
            .setColor(T.boost)
          return message.channel.send(Boosting)
        } catch (error) {
          console.log(error)
          return message.channel.send(errorm)
        }

      })
    })
  }
}
exports.help = {
  name: 'boost',
  aliases: ['boosting', 'boostbundle'],
}