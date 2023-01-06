const Discord = require("discord.js")
const settings =  require("../settings.json");
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');


exports.run = async(client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();

  let m = message.guild.id;
  let g = settings.General.Servers;
  let Disabled = new Discord.MessageEmbed()
  .setColor(T.blank)
  .setDescription("Command invalid in this guild.")
  if(m != g.Public && m != g.Leaders) return message.channel.send(Disabled);


  if(message.guild.id == settings.General.Servers.Public){

    let adduser = args.join(" ");
    let user = message.guild.members.cache.find(val => val.user.tag == adduser) || message.guild.members.cache.get(adduser) || message.mentions.members.first();
  
  
    if(!(await mongoose.models.Ticket.exists({guildID: message.guild.id.toString(), channelID: message.channel.id.toString()}))) { 
      let embed = new Discord.MessageEmbed()
      .setColor(T.red)
      .setDescription("You can only add people to tickets!")
      return message.channel.send(embed)
    }
  
    let ticketdata = await mongoose.models.Ticket.findOne({guildID: message.guild.id, channelID: message.channel.id});
    let embed = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription("This is not your ticket.")
    if(message.author.id != ticketdata.userID) return message.channel.send(embed);

  
    let embed1 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`Please set a user! \`${settings.General.Prefix}add user#0000\``)
    if(!adduser) return message.channel.send(embed1)
  
  
  
    let embed2 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`User \`${adduser}\` was not found in this guild!`)
    if(!user) message.channel.send(embed2)
  
    let staffProfile = await mongoose.models.Profile.findOne({guildID: message.guild.id, userID: user.id});
    let embed23 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("You can not add staff members to tickets!")
    if(staffProfile) return message.channel.send(embed23)
  
    let fulluser = user.user.username + "#" + user.user.discriminator;
  
    let doc = await mongoose.models.Ticket.findOne({channelID: message.channel.id});
    let embed4 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`User \`${fulluser}\` is already added to this ticket!`)
    if(doc.users.indexOf(user.id) >= 0) return message.channel.send(embed4)
    
  
    doc.users.push(user.id);
    await doc.save();
  
  
    message.channel.updateOverwrite(user, {            
        "READ_MESSAGES": true,
        "VIEW_CHANNEL": true,
        "SEND_MESSAGES": true,
        "ATTACH_FILES": true,
        "CONNECT": true,
        "CREATE_INSTANT_INVITE": false,
        "ADD_REACTIONS": true
    });
    
  
  
    let embed5 = new Discord.MessageEmbed()
    .setColor(T.green)
    .setDescription(`User \`${fulluser}\` was added to this ticket!`)
    message.channel.send(embed5)
  } else if(message.guild.id == settings.General.Servers.Leaders){
    if (message.author.bot || message.channel.type === 'dm') return;

    let embed1 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`Please set a user! \`.add user#0000\``)
    if(!args[0]) return message.channel.send(embed1)

    let adduser = message.content.split(" ")[1];
    let user = message.guild.members.cache.find(val => val.user.tag == adduser) || message.guild.members.cache.get(adduser) || message.mentions.members.first();



    let embed2 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription(`User \`${args[1]}\` was not found in this guild!`)
    if(!user) return message.channel.send(embed2)

    message.channel.updateOverwrite(user, {            
      "READ_MESSAGES": true,
      "VIEW_CHANNEL": true,
      "SEND_MESSAGES": true,
      "ATTACH_FILES": true,
      "CONNECT": true,
      "CREATE_INSTANT_INVITE": false,
      "ADD_REACTIONS": true
  });

  let embed5 = new Discord.MessageEmbed()
  .setColor(T.green)
  .setDescription(`User \`${user.user.tag}\` was added to this ticket!`)
  message.channel.send(embed5)

  }


  
}
exports.help = {
  name: 'add',
  aliases: ['adduser'],
}
