const Discord = require('discord.js');
const settings = require('../settings.json');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const mongoose = require('../util/mongoose.js');
const moment = require('moment');



module.exports = (Client, message) => {


    
    Client.on('message', async message => {
    if(message.author.bot) return;
    return;
    //console.log(message)
//    console.log(message.content)
//
//    message.channel.send(message.content)
//
//    let embed = new Discord.MessageEmbed()
//    .setDescription(message.content)
//    return message.channel.send(embed)


let filter = m => m.author.id === message.author.id
    message.channel.send(`Are you sure to delete all data? \`YES\` / \`NO\``).then(() => {
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
            message.channel.send(`Deleted`)
          } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
            message.channel.send(`Terminated`)
          } else {
            message.channel.send(`Terminated: Invalid Response`)
          }
        })
        .catch(collected => {
            message.channel.send('Timeout');
        });
    })

    })
}