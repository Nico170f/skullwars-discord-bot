const mongoose = require('../util/mongoose.js');
const Discord = require('discord.js');
const settings = require('../settings.json');
const { Rcon } = require('rcon-client');
const T = settings.General.Theme;


module.exports = async (client, member) => {
  const warningChannel = member.guild.channels.cache.find(c => c.id === settings.Channels.Warnings) //36393F
  let StaffMovement = member.guild.channels.cache.find(c => c.id === settings.Channels.StaffMovement) //36393F
  const hub = new Rcon({host: settings.RCon.hub.host, port: settings.RCon.hub.port, password: settings.RCon.hub.pass})
  hub.on("authenticated", () => console.log("authenticated"))
  hub.on("connect", () => console.log("RCON has connected"))
  hub.on("end", () => console.log("end"))

  let profile = await mongoose.models.Profile.findOne({
    guildID: member.guild.id,
    userID: member.user.id
  });
  let ign;


  if(profile){
    ign = profile.ign;
    console.log("Staff member left a SW Discord! Their staff profile will be deleted...")

    //Removing staff profile
    try{
      await mongoose.models.Profile.deleteOne({guildID: member.guild.id.toString(), userID: member.user.id.toString()});
    } catch(err){
      console.log(err)
      warningChannel.send(`@everyone\n\nWARNING | A Staff member left but there was an error removing the staff profile!\n`)
      await warningChannel.send(`\`\`\`diff\n+ ERROR INFO:\n- errno: ${err.errno}\n- code: ${err.code}\n- syscall: ${err.syscall}\`\`\``)
    }
  
    //Removing staff perms ingame
    try {
      await hub.connect();
      (await hub.send(`lp user ${ign} group set default`))
      hub.end()  
      await mongoose.models.Profile.deleteOne({guildID: member.guild.id.toString(), userID: member.user.id.toString()});
      console.log("Sucessfully updated staff user ingame!")

    } catch (err) {
      console.log(err)
      console.log("There has been an error updating staff rank ingame!")
      
      warningChannel.send(`@everyone\n\nWARNING | A Staff member left but there was an error removing their perms ingame!\n`)
      await warningChannel.send(`\`\`\`diff\n+ ERROR INFO:\n- errno: ${err.errno}\n- code: ${err.code}\n- syscall: ${err.syscall}\`\`\``)

    }

    let info = `https://cravatar.eu/head/${ign}/100.png`
    let e2 = new Discord.MessageEmbed()
    .setColor(T.blank) //36393F
    .setAuthor(`Staff Member Removed!`, info)
    .setDescription(`<:Removed:823987984574971984> <@!${member.user.id}> has been removed from the Staff Team!`)
    .setFooter(`IGN: ${ign}`)
    .setTimestamp()
    StaffMovement.send(e2);

  }


  if (member.guild.id != settings.General.Servers.Public) return;
  const logembed = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription(`${member.user.tag}! (*${member.user.id}*)`)
    .setFooter("Member count: " + member.guild.memberCount)

  let logmsg = member.guild.channels.cache.find(c => c.id === settings.Channels.MemberLog);
  logmsg.send({
    embed: logembed
  });
};