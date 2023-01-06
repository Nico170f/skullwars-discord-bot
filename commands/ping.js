const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const settings = require('../settings.json');
const T = settings.General.Theme;
const mongoose = require('../util/mongoose.js');
const G = require('../functions/cmdupdate.js');
exports.run = async (client, message, args) => {
G.updateGuild();

    let heartbeat = 0;

    client.ws.shards.each( shard => {

      heartbeat += shard.ping

    })

    message.channel.send('Loading...').then( m => {
      return m.edit("Loaded!", new MessageEmbed()
      .setDescription(`${roundTo(client.ws.ping,2)} ms`)
      .setColor("BLACK")
    
    )})
  }


function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {
        n = (n * -1).toFixed(2);
    }
    return n;


    
}
exports.help = {
  name: 'ping',
  aliases: ["latency"]
}
