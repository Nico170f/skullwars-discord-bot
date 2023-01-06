const Discord = require("discord.js");
const mongoose = require('../util/mongoose.js');
const settings =  require("../settings.json");
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');
module.exports.run = async (bot, message, args) => {
    G.updateGuild();
    let m = message.guild.id;
    let g = settings.General.Servers;
    let Disabled = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription("Command invalid in this guild.")
    if(m != g.Public) return message.channel.send(Disabled);
    
    let removeuser = args.join(" ");
    let user = message.mentions.members.first() || message.guild.members.cache.get(removeuser) || message.guild.members.cache.find(val => val.user.tag == removeuser);
    
    if(!(await mongoose.models.Ticket.exists({guildID: message.guild.id.toString(), channelID: message.channel.id.toString()}))) {
        let embed1 = new Discord.MessageEmbed()
        .setColor(T.red)
        .setDescription("You can only remove people from tickets!")
        return message.channel.send(embed1)
    }

    let ticketdata = await mongoose.models.Ticket.findOne({guildID: message.guild.id, channelID: message.channel.id});
    let embed = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription("This is not your ticket.")
    if(message.author.id != ticketdata.userID) return message.channel.send(embed);

    let embed2 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`Please set a user! \`${settings.General.Prefix}remove user#0000\``)
    if(!removeuser) return message.channel.send(embed2)

    
    let embed3 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`User \`${removeuser}\` was not found in this guild!`)
    if(!user) return message.channel.send(embed3)

    let staffProfile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: user.id});
    let embed5 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("You can not remove staff members from tickets!")
    if(staffProfile) return message.channel.send(embed5)

    let fulluser = user.user.username + "#" + user.user.discriminator;

    let doc = await mongoose.models.Ticket.findOne({channelID: message.channel.id});
    let embed6 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`User \`${fulluser}\` is not added to this ticket!`)
    if(doc.users.indexOf(user.id) < 0) return message.channel.send(embed6)


    doc.users.splice(doc.users.indexOf(user.id), 1);
    await doc.save();


    message.channel.updateOverwrite(user, {
        "READ_MESSAGES": false,
        "VIEW_CHANNEL": false,
        "SEND_MESSAGES": false,
        "ATTACH_FILES": false,
        "CONNECT": false,
        "CREATE_INSTANT_INVITE": false,
        "ADD_REACTIONS": false
    });

    let embed7 = new Discord.MessageEmbed()
    .setColor(T.green)
    .setDescription(`User \`${fulluser}\` was removed from this ticket!`)
    message.channel.send(embed7)
    //console.log(user.user.username + "#" + user.user.discriminator)

};
exports.help = {
    name: 'remove',
    aliases: ['removeuser'],
  }
  