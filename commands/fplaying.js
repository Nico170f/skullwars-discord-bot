const Discord = require("discord.js")
const Client = new Discord.Client();
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
const mysql = require('mysql');
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
  var table = cInfo.FactionTable;

  const staffProfile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  });

  if(!settings.General.PermissionBypass.includes(message.author.id)){
  let notStaff = new Discord.MessageEmbed()
    .setDescription(`You are not a staff member.`)
    .setColor(T.blank)
    if (!staffProfile) return message.channel.send(notStaff);

  let notHigh = new Discord.MessageEmbed()
    .setDescription(`You are not allowed to use this command.`)
    .setColor(T.blank)
    if (staffProfile.rank <= 2) return message.channel.send(notHigh)
}

  if (args[0]) {
    if (args[0].toLowerCase() === "setup") {
      if (staffProfile.rank < 6) return message.channel.send(notHigh)
      let Setup = new Discord.MessageEmbed()
        .setDescription(`Setup`)
        .setColor(T.blank);
      message.channel.send(Setup);
      //return message.channel.send(settings.Boosting.RewardsGif)
      return message.channel.send({files: [`././media/FactionBundle.mp4`]})

    } else if (args[0].toLowerCase() === "remove") {
      if (staffProfile.rank < 6) return message.channel.send(notHigh)

      if (!args[1]) {
        let completed = new Discord.MessageEmbed()
          .setDescription(`Correct syntax: \`.fplaying remove <Faction>\``)
          .setColor(T.blank)
        return message.channel.send(completed)
      }

      con.connect(async function (err) {
        con.query(`SELECT * FROM ${table}`, async function (err, result, rows) {

          try {
            for (var i = 0; i < result.length; i++) {
              if (result[i].tag.toLowerCase() === args[1].toLowerCase()) {
                con.query(`DELETE FROM ${table} WHERE tag = "${args[1]}"`, async function (err, result, rows) {})
                con.end();

                updateFactions();
                let completed = new Discord.MessageEmbed()
                .setDescription(`${args[1]} was removed from Factions playing.`)
                .setColor(T.blank)
                return message.channel.send(completed)
              }
            }
            let completed = new Discord.MessageEmbed()
            .setDescription(`The Faction: \`${args[1]}\` was not found.`)
            .setColor(T.blank)
            return message.channel.send(completed)
          } catch (error) {
            console.log(error)
            return message.channel.send("An error has occured.")
          }
        })
      })
    }else if (args[0].toLowerCase() === "changeign") {
      if (staffProfile.rank < 6) return message.channel.send(notHigh)

      let completed = new Discord.MessageEmbed()
      .setDescription(`Correct syntax: \`.fplaying changeign <Faction> <IGN>\``)
      .setColor(T.blank)
      if (!args[1]) return message.channel.send(completed)
      if (!args[2]) return message.channel.send(completed)

      

      con.connect(async function (err) {
        con.query(`SELECT * FROM ${table}`, async function (err, result, rows) {

          try {
            for (var i = 0; i < result.length; i++) {
              if (result[i].tag.toLowerCase() === args[1].toLowerCase()) {
                //con.query(`DELETE FROM ${table} WHERE tag = "${args[1]}"`, async function (err, result, rows) {})
                try {
                  con.query(`UPDATE ${table} SET ign = "${args[2].toLowerCase()}" WHERE tag = '${args[1].toLowerCase()}'`, async function (err, result, rows) {})
                } catch (error) {
                  console.log(error);
                  return message.channel.send("Error occured.")
                }

                let completed = new Discord.MessageEmbed()
                .setDescription(`The owner of \`${args[1]}\` has been changed to \`${args[2]}\`.`)
                .setColor(T.blank)
                return message.channel.send(completed)
              }
            }
            con.end();
            let completed = new Discord.MessageEmbed()
            .setDescription(`The Faction: \`${args[1]}\` was not found.`)
            .setColor(T.blank)
            return message.channel.send(completed)
          } catch (error) {
            console.log(error)
            return message.channel.send("An error has occured.")
          }
          
        })
      })
    }
  }

  let user = /*message.guild.members.cache.find(val => val.user.tag == adduser) || message.guild.members.cache.get(adduser) || */ message.mentions.members.first();
  let noUser = new Discord.MessageEmbed()
    .setDescription(`Please use the correct syntax.\n➜ \`${settings.General.Prefix}fplaying <@Faction Leader> <Leader IGN> <Faction Name>\``)
    .setColor(T.blank)

  let p = settings.General.Prefix;
  let fplayingMenu = new Discord.MessageEmbed()
    //.setTitle("Factions Playing | Help")
    .setAuthor("Factions Playing | Help", message.guild.iconURL())
    .setDescription(`The FPlaying command contains a couple useful subcommands other than simply signing up Factions. Below this message are the avaliable commands listed. *Resetting Faction Signups can be done with the __${p}reset__ command.*\n\n**Commands:**\n➜ ${p}Fplaying remove <Faction>\n➜ ${p}Fplaying ChangeIGN <Faction> <IGN>`)
    .addField("Signing up a Faction:", `➜ \`${p}fplaying <@Faction Leader> <Leader IGN> <Faction>\`\n➜ *${p}Fplaying <@${message.author.id}> ${message.author.tag.split("#")[0]} ${message.author.tag.split("#")[0]}Faction*`)
    .setColor(T.blank)
    .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")


  if (message.content.includes("remove") || message.content.includes("update") || message.content.includes("setup") || message.content.includes("changeign")) return;
  if (!args[1]) return message.channel.send(fplayingMenu);
  if (!args[2]) return message.channel.send(noUser);
  if (!user) return message.channel.send(noUser);

  let id = user.id;
  let leaderIGN = args[1].toLowerCase();
  let factionTAG = args[2].toLowerCase();
  let array = [`${args[2]}:${id}:${args[1]}`];
  let Factions = "";
  let ownerID = "";
  let ownerIGN = "";

  let alreadySigned = new Discord.MessageEmbed()
    .setDescription(`A Faction with this information is already signed up!`)
    .setColor(T.blank)

  con.connect(async function (err) {
    con.query(`SELECT * FROM ${table}`, async function (err, result, rows) {
      try {
        for (var i = 0; i < result.length; i++) {
          if (result[i].tag.toLowerCase() === factionTAG || result[i].ign.toLowerCase() === leaderIGN || result[i].id === user.id) {
            return message.channel.send(alreadySigned);
          }
        }

        con.query(`INSERT INTO \`${table}\` (\`tag\`, \`ign\`, \`id\`, \`claimed\`) VALUES ('${args[2]}', '${args[1]}', '${user.id}', '0')`, async function (err, result, rows) {
          if (err) {
            console.log(err)
            return message.channel.send("Error occured.")
          }
        })

        user.setNickname(`[${args[2]}] ` + user.user.username)
        const leaderRole = message.guild.roles.cache.find(role => role.id === settings.Roles.PublicFactionLeader);
        user.roles.add(leaderRole)

        let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
        let embed24 = new Discord.MessageEmbed()
        .setColor(T.green)
        .setDescription(`${message.author} signed a faction for the upcomming map.\n\nUser: ${user}\nIGN: \`${args[1]}\`\nFaction: \`${args[2]}\``)
        modLogs.send(embed24)


        try {
          user.send(`You've been signed up to the upcoming map on the SkullWars Network! Please join the Faction Leader Discord below to stay updated! You'll also be given your own personal channel.\n\n${settings.FactionSignup.DiscordInvite}`);
        } catch (error) {
          console.log("Could not DM this user about signup.")
        }

        let completed = new Discord.MessageEmbed() //➜
          .setAuthor("Faction signed up!", message.guild.iconURL())
          //.setTitle("Faction signed up!", message.guild.iconURL())
          .setDescription(`A Faction with the information below has been signed \nup for the next release!`)
          .addField(`Information:`, `➜ Faction: ${args[2]} \n➜ Owner: <@${user.id}>\n➜ IGN: ${args[1]}`)
          .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656401881399296/SkullWars_Tickets_Sword.png")
          .setColor(T.green)
        message.channel.send(completed);

        updateFactions()
        con.end();
        return;

      } catch (error) {
        console.log(error)
      }
    })
  })



  function updateFactions(){

    let array = [];
    let Factions = "";
    let ownerID = "";
    let ownerIGN = "";
  
    con.connect(async function (err) {
      con.query(`SELECT * FROM ${table}`, async function (err, result, rows) {
        try {
          for (var i = 0; i < result.length; i++) {
            array.push(`${result[i].tag}:${result[i].id}:${result[i].ign}`)
          }
  
          for (let val of array) {
            Factions = Factions + "\n➜ " + val.split(":")[0];
            ownerID = ownerID + `\n<@` + val.split(":")[1] + ">";
            ownerIGN = ownerIGN + `\n` + val.split(":")[2];
          }
  
          let link;
          if (!settings.FactionSignup.ReleaseCountdown.includes("https://")) {
            link = "";
          } else {
            link = `[Release Countdown](${settings.FactionSignup.ReleaseCountdown})`
          }
  
          let Updated = new Discord.MessageEmbed()
            .setTitle("Factions Playing Zanak", message.guild.iconURL())
            .setDescription(`Below are the current Factions who has signed up \nfor ${settings.General.Zanak.CurrentMap}! ${link}\n\nTotal Faction Signups: \`${result.length}\``)
            .addField("Faction", `${Factions}`, true)
            .addField("Owner", `${ownerID}`, true)
            .addField("Bundle", `Redeem the bundle in-game using the\n\`/fbundle\` command. *Sign up through tickets to receive a bundle for free!*`)
            .setColor(T.blank)
  
          const updateChannel = client.channels.cache.get(settings.FactionSignup.FactionsChannel);
          updateChannel.messages.fetch(settings.FactionSignup.FactionsMessage).then(msg => {
            msg.edit(Updated)
          })
  
        } catch (error) {
          console.log(error)
        }
        con.end();
      })
    })


  }






}
exports.help = {
  name: 'fplaying',
  aliases: ['signup'],
}