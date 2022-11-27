const Discord = require('discord.js');
const settings = require('../settings.json');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const mongoose = require('../util/mongoose.js');
const moment = require('moment');
const T = settings.General.Theme;
const C = settings.Categories;


module.exports = (Client, message) => {

    Client.on('messageReactionAdd', async (reaction, user, channel, message) => {
        if (user.bot) return;
        if (reaction.message.channel.id !== settings.Support.TicketChannelID) return;
      
        let lmao = false;
        //console.log(reaction.emoji.name)
        if (reaction.emoji.name === 'SkullWars_Tickets_Sword') {
          var categoryChannel = Client.channels.cache.get(C.Factions);
          var nameeee = "Factions";
        } else if (reaction.emoji.name === 'SkullWars_Tickets_Crown') {
          var categoryChannel = Client.channels.cache.get(C.Buycraft);
          var nameeee = "BuyCraft";
        } else if (reaction.emoji.name === 'SkullWars_Tickets_Unban') {
          var categoryChannel = Client.channels.cache.get(C.Appeal);
          var nameeee = "Ban Appeal";
        } else if (reaction.emoji.name === 'SkullWars_Tickets_Key') {
          var categoryChannel = Client.channels.cache.get(C.Bug);
          var nameeee = "Bug Report";
          lmao = true;
        }
      
      
        reaction.users.remove(user)
        const guild = reaction.message.guild;
        const member111 = guild.members.cache.find(member => member.id === user.id)
        //console.log(member111.roles.map(r => `${r}`).join(' | '), true)
        if (member111.roles.cache.has(settings.Roles.Muted)) return;
      
      
      
        //message.member.roles.cache.has(permRole)
        //Verify that no tickets exist for this user
        if (await mongoose.models.Ticket.exists({
            guildID: reaction.message.guild.id.toString(),
            userID: user.id.toString(),
            parentID: categoryChannel.id.toString()
          })) { //return console.log("User already has a ticket");
          const fetchChannel2 = Client.channels.cache.get(settings.Support.TicketChannelID);
      
          let maxopen = new Discord.MessageEmbed()
            .setColor(T.red)
            .setDescription("You can only open `1` ticket in this category!")
      
          return fetchChannel2.send(maxopen)
            .then(msg => {
              msg.delete({
                timeout: 5000
              })
            })
      
        }
      
        const ticketguild = await mongoose.models.Guild.findOne({guildID: reaction.message.guild.id.toString()});
        if (user.bot) return;
        if (reaction.emoji.name === 'SkullWars_Tickets_Sword' || 'SkullWars_Tickets_Crown' || 'SkullWars_Tickets_Unban' || 'SkullWars_Tickets_Key') {
      
          var tickets = ticketguild.ticket;
          fs.writeFile(`././ticketlogs/ticket-${tickets}.txt`, "", function (err) {
            if (err) throw err;
          })

          let date = moment(new Date()).format('ddd DD-MMM-YYYY h:mm A')
          fs.writeFile(`././ticketlogs/ticket-${tickets}.txt`, `➜ User: ${user.username}#${user.discriminator} ⇢ (${user.id})\n➜ Date: ${date} \n➜ Support category: ${nameeee}\n➜ Ticket #: ${tickets}\n\n`, function (err) {
            if (err) throw err;
          });
      
          ticketguild.ticket += 1;
          await ticketguild.save();
          let role2 = reaction.message.guild.roles.cache.get(settings.Roles.Support)
          let role3 = reaction.message.guild.roles.cache.get(settings.Roles.Helper)
          let channel;
      
          if(lmao){
          channel = await reaction.message.guild.channels.create(`ticket-${tickets}`, {
            parent: categoryChannel,
            permissionOverwrites: [{
                deny: 'VIEW_CHANNEL',
                id: reaction.message.guild.id
              },
              {
                allow: 'VIEW_CHANNEL',
                id: user.id
              },
              {
                allow: 'VIEW_CHANNEL',
                id: role2.id
              },
              {
                allow: 'VIEW_CHANNEL',
                id: role3.id
              }
      
            ]
          });
          } else {
            channel = await reaction.message.guild.channels.create(`ticket-${tickets}`, {
              parent: categoryChannel,
              permissionOverwrites: [{
                  deny: 'VIEW_CHANNEL',
                  id: reaction.message.guild.id
                },
                {
                  allow: 'VIEW_CHANNEL',
                  id: user.id
                },
                {
                  allow: 'VIEW_CHANNEL',
                  id: role2.id
                },
        
              ]
            });
          }
      
          const FactionsEmbed = new Discord.MessageEmbed()
            .setAuthor('Factions Support', "https://media.discordapp.net/attachments/569219717559222307/807583429997756426/server-icon_1.png") //Close this ticket ➜ \`${data.prefix}close\`\n
            .setDescription(`Thank you for contacting our support team, <@${user.id}>! \n\n We will get right back to you, \nin the meantime, please describe your questions/issues thoroughly!\n\n**Avaliable commands:**\nAdd user to ticket ➜ \`${settings.General.Prefix}add user#0000\`\nRemove user from ticket ➜ \`${settings.General.Prefix}remove user#0000\``)
            //.addField(`Avaliable commands: `, `Close this ticket ➜ \`${data.prefix}close\`\nAdd user to ticket ➜ \`${data.prefix}add user#0000\`\nRemove user from ticket ➜ \`${data.prefix}remove user#0000\``)
            .setFooter('Skullwars')
            .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656401881399296/SkullWars_Tickets_Sword.png")
            .setTimestamp()
            .setColor(T.main);
      
          const BuycraftEmbed = new Discord.MessageEmbed()
            .setAuthor('BuyCraft Support', "https://media.discordapp.net/attachments/569219717559222307/807583429997756426/server-icon_1.png")
            .setDescription(`Thank you for contacting our support team, <@${user.id}>! \n\n We will get right back to you, \nin the meantime, please describe your questions/issues thoroughly and provide the information stated under this message!\n\`\`\`Transaction ID: <xxxxxxxxxxxxxxx>\nUsername: <IGN>\`\`\`\n**Avaliable commands:**\nAdd user to ticket ➜ \`${settings.General.Prefix}add user#0000\`\nRemove user from ticket ➜ \`${settings.General.Prefix}remove user#0000\``)
            .setFooter('Skullwars')
            .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656399749775440/SkullWars_Tickets_Crown.png")
            .setTimestamp()
            .setColor(T.main);
      
          const BanEmbed = new Discord.MessageEmbed()
            .setAuthor('Ban Appeal', "https://media.discordapp.net/attachments/569219717559222307/807583429997756426/server-icon_1.png")
            .setDescription(`Thank you for contacting our support team, <@${user.id}>! \n\n We will get right back to you, \nin the meantime, please describe your questions/issues thoroughly and provide the information stated under this message!\n\`\`\`Username: <IGN>\nStaff: <IGN>\nBan Reason: <Reason>\`\`\`\n**Avaliable commands:**\nAdd user to ticket ➜ \`${settings.General.Prefix}add user#0000\`\nRemove user from ticket ➜ \`${settings.General.Prefix}remove user#0000\``)
            .setFooter('Skullwars')
            .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656398353072138/SkullWars_Tickets_Unban.png")
            .setTimestamp()
            .setColor(T.main);
      
          const BugEmbed = new Discord.MessageEmbed()
            .setAuthor('Bug Report', "https://media.discordapp.net/attachments/569219717559222307/807583429997756426/server-icon_1.png")
            .setDescription(`Thank you for contacting our support team, <@${user.id}>! \n\n We will get right back to you, \nin the meantime, please describe your questions/issues thoroughly and provide the information stated under this message!\n\`\`\`Username: <IGN>\nBug: <Description>\`\`\`\n**Avaliable commands:**\nAdd user to ticket ➜ \`${settings.General.Prefix}add user#0000\`\nRemove user from ticket ➜ \`${settings.General.Prefix}remove user#0000\``)
            .setFooter('Skullwars')
            .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656400530046986/SkullWars_Tickets_Key.png")
            .setTimestamp()
            .setColor(T.main);
      
      
          if (reaction.emoji.name === 'SkullWars_Tickets_Sword') {
            var ticketembed = FactionsEmbed;
          } else if (reaction.emoji.name === 'SkullWars_Tickets_Crown') {
            var ticketembed = BuycraftEmbed;
          } else if (reaction.emoji.name === 'SkullWars_Tickets_Unban') {
            var ticketembed = BanEmbed;
          } else if (reaction.emoji.name === 'SkullWars_Tickets_Key') {
            var ticketembed = BugEmbed;
          }
      
          const msg = await channel.send(ticketembed);
          //const usertag = await channel.send()
          let tagrole = reaction.message.guild.roles.cache.find(r => r.id === settings.Roles.Support)
          tagrole.edit({
            mentionable: true
          })
      
          let tagmsg = await channel.send(`${tagrole} <@${user.id}>`)
      

          setTimeout(function () {
              tagrole.edit({
                mentionable: false
              })
              tagmsg.delete()
            },
            1000);
      
      
          let doc = new mongoose.models.Ticket({
            guildID: reaction.message.guild.id.toString(),
            userID: user.id.toString(),
            channelID: channel.id.toString(),
            parentID: channel.parent.id.toString()
          });
          await doc.save();
        }
      })


    Client.on('messageReactionAdd', async (reaction, user, channel, message, client, users) => {
        if (user.bot) return;
        if (reaction.message.channel.id !== settings.Channels.Suggestions) return;
      
        let messageurl;
        var staffProfile = await mongoose.models.Profile.findOne({
          guildID: reaction.message.guild.id,
          userID: user.id
        });
        var suggestAcceptChannel = Client.channels.cache.get(settings.Channels.AcceptedSuggestions);
        var suggestionChannel = Client.channels.cache.get(settings.Channels.Suggestions);
        if (!suggestionChannel) return console.log("\x1b[31mSuggestion channel not found!");
        if (reaction.emoji.name === 'Added') {
      
          reaction.users.remove(user)
          if (!staffProfile) return console.log("\x1b[31mSomeone without a staff profile tried accepting a suggestion!");
          if (user.id !== "212878816362758144") {
            if (staffProfile.rank < 8) return;
          }
      
          //console.log("reaction found")
          let profile = await mongoose.models.Suggest.findOne({
            guildID: reaction.message.guild.id,
            messageID: reaction.message.id
          });
          if (!profile) {
            return console.log("Suggestion profile not found");
          } else {
      
            let suggestionEmbed = new Discord.MessageEmbed()
              .setColor(T.main)
              .setAuthor("", reaction.message.guild.iconURL())
              .setDescription(`A suggestion by \`${profile.authorTAG}\` has been accepted!`)
              .addField(`Suggestion:`, profile.suggestion)
              .setThumbnail(profile.embedURL)
            await suggestAcceptChannel.send(suggestionEmbed).then(embedMessage => {
              messageurl = embedMessage.url;
            })
      
            //console.log(reaction.message.guild)
            let acceptedEmbed = new Discord.MessageEmbed()
              .setColor(T.main)
              .setAuthor("Suggestion Accepted!", reaction.message.guild.iconURL())
              .setDescription(`[Your suggestion](${messageurl}) has been accepted in ${reaction.message.guild.name}!`)
      
            suggestionChannel.messages.fetch(profile.messageID)
              .then(message => message.delete())
              .catch(console.error)
      
      
            try {
              Client.users.cache.get(profile.authorID).send(acceptedEmbed);
            } catch (err) {
              console.log("ERR: " + err)
              console.log("Could not DM user suggestion receipt!")
            }
      
            await mongoose.models.Suggest.deleteOne({
              guildID: reaction.message.guild.id,
              messageID: reaction.message.id
            });
      
          }
        }
      
      })



}