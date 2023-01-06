const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const {
  Rcon
} = require('rcon-client');
const mongoose = require('../util/mongoose.js');
const settings = require('../settings.json');
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

  const HelpRank = "1";
  const modRank = "2";
  const SrModRank = "3";
  const JrAdminRank = "4";
  const AdminRank = "5";
  const SrAdminRank = "6";
  const ManagerRank = "7";
  const OperatorRank = "8";

  const rr1 = message.guild.roles.cache.find(role => role.id === settings.Roles.Helper);
  const rr2 = message.guild.roles.cache.find(role => role.id === settings.Roles.Mod);
  const rr3 = message.guild.roles.cache.find(role => role.id === settings.Roles.SrMod);
  const rr4 = message.guild.roles.cache.find(role => role.id === settings.Roles.JrAdmin);
  const rr5 = message.guild.roles.cache.find(role => role.id === settings.Roles.Admin);
  const rr6 = message.guild.roles.cache.find(role => role.id === settings.Roles.SrAdmin);
  const rr7 = message.guild.roles.cache.find(role => role.id === settings.Roles.Manager);
  const rr8 = message.guild.roles.cache.find(role => role.id === settings.Roles.Operator);

  const seniorR1 = message.guild.roles.cache.find(role => role.id === settings.Roles.Administration);
  const management1 = message.guild.roles.cache.find(role => role.id === settings.Roles.Management);

  const demotionChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.StaffMovement) //36393F
  const warningChannel = message.guild.channels.cache.find(c => c.id === settings.Channels.Warnings) //36393F

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
    .setDescription(`Your staff ranking can't do demotions!`)
    .setColor(T.red)
      if (staffProfile.rank < 7) return message.channel.send(notHigh)
  }

  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  let nostaff = new Discord.MessageEmbed()
    .setDescription(`Please mention a staff member to demote!`)
    .setColor(T.main)
  if (!user) return message.channel.send(nostaff)

  const profile = await mongoose.models.Profile.findOne({
    guildID: message.guild.id,
    userID: user.user.id
  });

  let tooHigh = new Discord.MessageEmbed()
    .setDescription(`➜ ${user} is higher ranked than you are!`)
    .setColor(T.red)
    if(!settings.General.PermissionBypass.includes(message.author.id)){
    if (staffProfile.rank < profile.rank) return message.channel.send(tooHigh)
  }

  let sameRank = new Discord.MessageEmbed()
    .setDescription(`➜ ${user} has the same ranking as you do!`)
    .setColor(T.red)
    if(!settings.General.PermissionBypass.includes(message.author.id)){
      if (staffProfile.rank === profile.rank) return message.channel.send(sameRank)
  }




  if (!profile) {
    let e1 = new Discord.MessageEmbed()
      .setColor(T.red) //36393F
      .setDescription(`➜ <@!${user.user.id}> is not a staff member!`)
    message.channel.send(e1)

  } else {
    const hub = new Rcon({
      host: settings.RCon.hub.host,
      port: settings.RCon.hub.port,
      password: settings.RCon.hub.pass
    })
    hub.on("authenticated", () => console.log("authenticated"))
    hub.on("connect", () => console.log("RCON has connected"))
    hub.on("end", () => console.log("end"))
    const proxy = new Rcon({
      host: settings.RCon.proxy.host,
      port: settings.RCon.proxy.port,
      password: settings.RCon.proxy.pass
    })
    proxy.on("authenticated", () => console.log("authenticated"))
    proxy.on("connect", () => console.log("RCON has connected"))
    proxy.on("end", () => console.log("end"))

    let orank = profile.rank;
    let addrole;
    let removerole;
    let rank;



    message.channel.send("Staff profile found.... Please wait!").then(msg => {
      msg.delete({
        timeout: 3000
      })
    })

    if (!args[1]) {
      if (profile.rank === 1) {
        user.roles.remove(rr1)
        await mongoose.models.Profile.deleteOne({
          guildID: message.guild.id.toString(),
          userID: user.user.id.toString()
        });

        let e2 = new Discord.MessageEmbed()
          .setColor("2f3136") //36393F
          .setAuthor(`Staff Member Removed!`, message.guild.iconURL())
          .setDescription(`<:Removed:823987984574971984> <@!${user.user.id}> has been removed from the Staff Team!`)
          .setFooter(`IGN: ${profile.IGN}`)
          .setTimestamp()
        demotionChannel.send(e2)

        let e3 = new Discord.MessageEmbed()
          .setColor(T.red) //36393F
          .setDescription(`➜ <@!${user.user.id}> has been removed from the Staff Team!`)
        return message.channel.send(e3)

      } else if (profile.rank === 2) {
        rank = "Helper"
        addrole = rr1;

        user.roles.remove(rr2)
        //user.roles.remove(modR1)
        user.roles.add(rr1)

        profile.rank = HelpRank;
        await profile.save();

      } else if (profile.rank === 3) {
        rank = "Mod"
        addrole = rr2;

        user.roles.remove(rr3)
        user.roles.add(rr2)

        profile.rank = modRank;
        await profile.save();

      } else if (profile.rank === 4) {
        rank = "Sr. Mod"
        addrole = rr3;

        user.roles.remove(rr4)
        user.roles.remove(seniorR1)
        user.roles.add(rr3)
        //user.roles.add(modR1)

        profile.rank = SrModRank;
        await profile.save();

      } else if (profile.rank === 5) {
        rank = "Jr. Admin"
        addrole = rr4;

        user.roles.remove(rr5)
        user.roles.add(rr4)

        profile.rank = JrAdminRank;
        await profile.save();

      } else if (profile.rank === 6) {
        profile.rank = AdminRank;

        user.roles.remove(rr6)
        user.roles.remove(management1)
        user.roles.add(rr5)
        user.roles.add(seniorR1)

        await profile.save();
        rank = "Admin"
        addrole = rr5;

      } else if (profile.rank === 7) {
        rank = "Sr. Admin"

        user.roles.remove(rr7)
        user.roles.add(rr6)

        addrole = rr6;
        profile.rank = SrAdminRank;
        await profile.save();

      } else if (profile.rank === 8) {
        rank = "Manager"

        user.roles.remove(rr8)
        user.roles.add(rr7)

        addrole = rr7;
        profile.rank = ManagerRank;
        await profile.save();

      } else if (profile.rank >= 9) {

        let e89 = new Discord.MessageEmbed()
          .setColor(T.red) //36393F
          .setDescription(`➜ <@!${user.user.id}> can not be demoted!`)
        return message.channel.send(e89)

      }

    } else {

      if (args[1].toLowerCase() === "helper") {
        if (HelpRank == profile.rank) {
          let e10 = new Discord.MessageEmbed()
            .setColor(T.main) //36393F
            .setDescription(`This staff member is already helper ➜ <@!${user.user.id}>`)
          return message.channel.send(e10)

        }

        if (user.roles.cache.has(rr2.id)) {
          user.roles.remove(rr2)
        }
        if (user.roles.cache.has(rr3.id)) {
          user.roles.remove(rr3)
        }
        if (user.roles.cache.has(rr4.id)) {
          user.roles.remove(rr4)
        }
        if (user.roles.cache.has(rr5.id)) {
          user.roles.remove(rr5)
        }
        if (user.roles.cache.has(rr6.id)) {
          user.roles.remove(rr6)
        }
        if (user.roles.cache.has(rr7.id)) {
          user.roles.remove(rr7)
        }
        if (user.roles.cache.has(rr8.id)) {
          user.roles.remove(rr8)
        }
        //if (user.roles.cache.has(modR1.id)) {
        //  user.roles.remove(modR1)
        //}
        if (user.roles.cache.has(seniorR1.id)) {
          user.roles.remove(seniorR1)
        }
        if (user.roles.cache.has(management1.id)) {
          user.roles.remove(management1)
        }

        user.roles.add(rr1)

        rank = "Helper"
        addrole = rr1;
        profile.rank = HelpRank;
        await profile.save();
      }

      if (args[1].toLowerCase() === "mod") {
        if (modRank > profile.rank) {
          let e12 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>'s current staff position is lower than Mod!`)
          return message.channel.send(e12)
        }

        if (modRank == profile.rank) {
          let e13 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>' is already Mod!`)
          return message.channel.send(e13)
        }

        if (user.roles.cache.has(rr3.id)) {
          user.roles.remove(rr3)
        }
        if (user.roles.cache.has(rr4.id)) {
          user.roles.remove(rr4)
        }
        if (user.roles.cache.has(rr5.id)) {
          user.roles.remove(rr5)
        }
        if (user.roles.cache.has(rr6.id)) {
          user.roles.remove(rr6)
        }
        if (user.roles.cache.has(rr7.id)) {
          user.roles.remove(rr7)
        }
        if (user.roles.cache.has(rr8.id)) {
          user.roles.remove(rr8)
        }
        if (user.roles.cache.has(seniorR1.id)) {
          user.roles.remove(seniorR1)
        }
        if (user.roles.cache.has(management1.id)) {
          user.roles.remove(management1)
        }


        user.roles.add(rr2)//.then(user => user.roles.add(modR1))

        rank = "Mod"
        addrole = rr2;
        profile.rank = modRank;
        await profile.save();
      }

      if (args[1].toLowerCase() === "sr.mod" || args[1].toLowerCase() === "srmod" || args[1].toLowerCase() === "sr-mod") {
        if (SrModRank > profile.rank) {
          let e14 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>'s current staff position is lower than Sr. Mod.`)
          return message.channel.send(e14)
        }

        if (SrModRank == profile.rank) {
          let e15 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>' is already Sr. Mod!`)
          return message.channel.send(e15)
        }

        if (user.roles.cache.has(rr4.id)) {
          user.roles.remove(rr4)
        }
        if (user.roles.cache.has(rr5.id)) {
          user.roles.remove(rr5)
        }
        if (user.roles.cache.has(rr6.id)) {
          user.roles.remove(rr6)
        }
        if (user.roles.cache.has(rr7.id)) {
          user.roles.remove(rr7)
        }
        if (user.roles.cache.has(rr8.id)) {
          user.roles.remove(rr8)
        }
        if (user.roles.cache.has(seniorR1.id)) {
          user.roles.remove(seniorR1)
        }
        if (user.roles.cache.has(management1.id)) {
          user.roles.remove(management1)
        }

        user.roles.add(rr3)//.then(user => user.roles.add(modR1))

        rank = "Sr. Mod"
        addrole = rr3;
        profile.rank = SrModRank;
        await profile.save();
      }

      if (args[1].toLowerCase() === "jr.admin" || args[1].toLowerCase() === "jradmin" || args[1].toLowerCase() === "jr-admin") {
        if (JrAdminRank > profile.rank) {
          let e17 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>'s current staff position is lower than Jr. Admin!`)
          return message.channel.send(e17)
        }

        if (JrAdminRank == profile.rank) {
          let e18 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>' is already Jr. Admin!`)
          return message.channel.send(e18)
        }


        if (user.roles.cache.has(rr5.id)) {
          user.roles.remove(rr5)
        }
        if (user.roles.cache.has(rr6.id)) {
          user.roles.remove(rr6)
        }
        if (user.roles.cache.has(rr7.id)) {
          user.roles.remove(rr7)
        }
        if (user.roles.cache.has(rr8.id)) {
          user.roles.remove(rr8)
        }
        if (user.roles.cache.has(management1.id)) {
          user.roles.remove(management1)
        }


        user.roles.add(rr4).then(user => user.roles.add(seniorR1))

        rank = "Jr. Admin"
        addrole = rr4;
        profile.rank = JrAdminRank;
        await profile.save();
      }

      if (args[1].toLowerCase() === "admin") {
        if (AdminRank > profile.rank) {
          let e20 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>'s current staff position is lower than Admin!`)
          return message.channel.send(e20)
        }

        if (AdminRank == profile.rank) {
          let e21 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>' is already Admin!`)
          return message.channel.send(e21)
        }

        if (user.roles.cache.has(rr6.id)) {
          user.roles.remove(rr6)
        }
        if (user.roles.cache.has(rr7.id)) {
          user.roles.remove(rr7)
        }
        if (user.roles.cache.has(rr8.id)) {
          user.roles.remove(rr8)
        }
        if (user.roles.cache.has(management1.id)) {
          user.roles.remove(management1)
        }

        user.roles.add(rr5).then(user => user.roles.add(seniorR1))

        rank = "Admin"
        addrole = rr5;
        profile.rank = AdminRank;
        await profile.save();
      }

      if (args[1].toLowerCase() === "sr-admin" || args[1].toLowerCase() === "sradmin" || args[1].toLowerCase() === "sr.admin") {
        if (SrAdminRank > profile.rank) {
          let e23 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>'s current staff position is lower than Sr. Admin!`)
          return message.channel.send(e23)
        }

        if (SrAdminRank == profile.rank) {
          let e24 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>' is already Sr. Admin!`)
          return message.channel.send(e24)
        }

        if (user.roles.cache.has(rr7.id)) {
          user.roles.remove(rr7)
        }
        if (user.roles.cache.has(rr8.id)) {
          user.roles.remove(rr8)
        }

        user.roles.add(rr6)

        rank = "Sr. Admin"
        addrole = rr6;
        profile.rank = SrAdminRank;
        await profile.save();
      }

      if (args[1].toLowerCase() === "manager") {
        if (ManagerRank > profile.rank) {
          let e26 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>'s current staff position is lower than Manager!`)
          return message.channel.send(e26)
        }

        if (ManagerRank == profile.rank) {
          let e27 = new Discord.MessageEmbed()
            .setColor(T.red) //36393F
            .setDescription(`➜ <@!${user.user.id}>' is already Manager!`)
          return message.channel.send(e27)
        }


        user.roles.remove(rr8)
        user.roles.add(rr7)

        addrole = rr7;
        rank = "Manager"
        profile.rank = ManagerRank;
        await profile.save();
      }

      if (args[1].toLowerCase() === "operator") {
        let e29 = new Discord.MessageEmbed()
          .setColor(T.red) //36393F
          .setDescription(`Staff members can not be demoted to operator!`)
        return message.channel.send(e29);
      }

      if (args[1].toLowerCase() === "owner") {
        let e30 = new Discord.MessageEmbed()
          .setColor(T.red) //36393F
          .setDescription(`Staff members can not be demoted to owner!`)
        return message.channel.send(e30);
      }


    }

    user.setNickname(`[${rank}] ${profile.IGN}`)


    let beforeRank;
    if (orank == 8) {
      beforeRank = rr8;
      beforeRankName = "Operator"
    } else if (orank == 7) {
      beforeRankName = "Manager"
      beforeRank = rr7;
    } else if (orank == 6) {
      beforeRankName = "Sr. Admin"
      beforeRank = rr6;
    } else if (orank == 5) {
      beforeRankName = "Admin"
      beforeRank = rr5;
    } else if (orank == 4) {
      beforeRankName = "Jr. Admin"
      beforeRank = rr4;
    } else if (orank == 3) {
      beforeRankName = "Sr. Mod"
      beforeRank = rr3;
    } else if (orank == 2) {
      beforeRankName = "Mod"
      beforeRank = rr2;
    } else if (orank == 1) {
      beforeRankName = "Helper"
      beforeRank = rr1;
    }


    let SuccessEmbed = new Discord.MessageEmbed()
      .setColor(T.main) //36393F
      .setDescription(`➜ <@!${user.user.id}> has been demoted to ${addrole}!`)
    message.channel.send(SuccessEmbed)


    let info = `https://cravatar.eu/head/${profile.IGN}/100.png`
    let demotionEmbed = new Discord.MessageEmbed()
      .setColor("2f3136") //36393F    2f3136 T.red
      .setAuthor(`New Demotion!`, info)
      .setDescription(`<:Demotion:823983645245177876> <@!${user.user.id}> has been demoted from: ${beforeRank} ➜ ${addrole}!`)
      .setTimestamp()
      .setFooter(`IGN: ${profile.IGN}`)
    demotionChannel.send(demotionEmbed)





    var s1 = `${beforeRankName} -> ${rank}`
    let update = s1.length;
    //console.log("length1: " + update)
    let spacing;
    //console.log(update)
    if (update === 10) {
      spacing = `                           &7`
      //console.log("spacing 10")

    } else if (update === 11) {
      spacing = `                          &7`
      //console.log("spacing 11")

    } else if (update === 12) {
      spacing = `                         &7`
      //console.log("spacing 12")

    } else if (update === 13) {
      spacing = `                      &7`
      //console.log("spacing 13")

    } else if (update === 14) {
      spacing = `                       &7`
      //console.log("spacing 14")

    } else if (update === 15) {
      spacing = `                        &7`
      //console.log("spacing 15")

    } else if (update === 16) {
      spacing = `                       &7`
      //console.log("spacing 16")

    } else if (update === 17) {
      spacing = `                    &7`
      //console.log("spacing 17")

    } else if (update === 18) {
      spacing = `                    &7`
      //console.log("spacing 18")

    } else if (update === 19) {
      spacing = `                 &7`
      //console.log("spacing 19")

    } else if (update === 20) {
      spacing = `                 &7`
      //console.log("spacing 20")

    } else if (update === 21) {
      spacing = `                  &7`
      //console.log("spacing 21")

    } else if (update === 22) {
      spacing = `                 &7`
      //console.log("spacing 22")
    } else if (update > 23 || update2 < 9) {
      console.log("ERROR: IGN EITHER TOO LONG OR TOO SHORT")
      return;
    }


    var s2 = `${profile.IGN}` //${profile.IGN}
    let update2 = s2.length;
    let spacing2;

    if (update2 === 2) {
      spacing2 = `                        &7`
      //console.log("spacing 2")

    } else if (update2 === 1) {
      spacing2 = `                         &7`
      //console.log("spacing 1")

    } else if (update2 === 3) {
      spacing2 = `                       &7`
      //console.log("spacing 3")

    } else if (update2 === 4) {
      spacing2 = `                       &7`
      //console.log("spacing 4")

    } else if (update2 === 5) {
      spacing2 = `                       &7`
      //console.log("spacing 5")

    } else if (update2 === 6) {
      spacing2 = `                      &7`
      //console.log("spacing 6")

    } else if (update2 === 7) {
      spacing2 = `                     &7`
      //console.log("spacing 7")

    } else if (update2 === 8) {
      spacing2 = `                     &7`
      //console.log("spacing 8")

    } else if (update2 === 9) {
      spacing2 = `                    &7`
      //console.log("spacing 9")

    } else if (update2 === 10) {
      spacing2 = `                   &7`
      //console.log("spacing 10")

    } else if (update2 === 11) {
      spacing2 = `                   &7`
      //console.log("spacing 11")

    } else if (update2 === 12) {
      spacing2 = `                  &7`
      //console.log("spacing 12")

    } else if (update2 === 13) {
      spacing2 = `                 &7`
      //console.log("spacing 13")

    } else if (update2 === 14) {
      spacing2 = `                &7`
      //console.log("spacing 14")

    } else if (update2 === 15) {
      spacing2 = `                &7`
      //console.log("spacing 15")

    } else if (update2 === 16) {
      spacing2 = `               &7`
      //console.log("spacing 16")

    } else if (update2 > 16 || update2 < 2) {
      console.log("ERROR: IGN EITHER TOO LONG OR TOO SHORT")
      return;
    }


    let rankPart = `${spacing}Rank: &f${beforeRankName} &7-> &f${rank}\n` // ${spacing}Rank: &fSr. Admin &7-> &f${rank}
    let titlePart = `                       &c&lStaff Demotion\n`
    let ignPart = `${spacing2}&7IGN: &f${profile.IGN}\n`
    let totalPart = `${titlePart}${ignPart}${rankPart}`


    if (settings.RCon.hub.enabled) {
      try {

        if (rank === "Sr. Mod") {
          rank = "sr-mod"
        }
        if (rank === "Jr. Admin") {
          rank = "jr-admin"
        }
        if (rank === "Sr. Admin") {
          rank = "sr-admin"
        }

        await hub.connect();
        (await hub.send(`lp user ${profile.IGN} group set ${rank}`))
        hub.end()
        console.log("Sucessfully updated staff user ingame!")

      } catch (err) {
        console.log(err)
        console.log("There has been an error updating staff rank ingame!")

        warningChannel.send(`@everyone\n\nWARNING | ERROR ISSUING STAFF PROMOTION INGAME\nUSER: ${user} \nIGN: \`${profile.IGN}\``)
        await warningChannel.send(`\`\`\`diff\n+ ERROR INFO:\n- errno: ${err.errno}\n- code: ${err.code}\n- syscall: ${err.syscall}\`\`\``)
      }
    }

    if (settings.RCon.proxy.enabled) {
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
  }

}
exports.help = {
  name: 'dm',
  aliases: ['demote'],
}