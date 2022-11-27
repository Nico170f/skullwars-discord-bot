const Discord = require('discord.js');
const settings = require('../settings.json');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const T = settings.General.Theme;
const mysql = require('mysql');

let cInfo = settings.Database.MySQL;
var con = mysql.createConnection({
    host: cInfo.host,
    user: cInfo.user,
    password: cInfo.password,
    database: cInfo.database
});
var table = cInfo.FactionTable;

module.exports = (Client, message) => {
    Client.on('guildMemberAdd', member => {
        if (member.guild.id != settings.General.Servers.Leaders) return;
        let ZanakRole = member.guild.roles.cache.get(settings.Roles.FLeaderZanak);
        member.roles.add(ZanakRole)

        let channel;
        con.connect(async function (err) {
            if(err) console.log(err);
            if(err) return console.log("\x1b[31mError connecting to MYSQL Database.");
            con.query(`SELECT * FROM ${table}`, async function (err, result, rows) {
                if(err) console.log(err);
                if(err) return console.log("\x1b[31mError connecting to MYSQL Database.");
                console.log(result)
                if (result.length === 0 || !result) return console.log("\x1b[31mNo signups yet, skipping (Faction Leader Join) function.")
                try {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].id === member.user.id) {
                            let channel1 = member.guild.channels.cache.find(r => r.name.toLowerCase() === result[i].tag.toLowerCase());
                            if (channel1) return console.log("\x1b[31mFaction with the name: \"" + result[i].tag.toLowerCase() + "\" already has a channel created, skipping.");

                            let leaderRole = member.guild.roles.cache.get(settings.Roles.FLeaderLeader);
                            member.roles.add(leaderRole)

                            let staffrole = member.guild.roles.cache.get(settings.Roles.FLeaderStaff)
                            channel = await member.guild.channels.create(result[i].tag, {
                                parent: Client.channels.cache.get(settings.Categories.PlayingZanak),
                                permissionOverwrites: [{
                                        deny: 'VIEW_CHANNEL',
                                        id: member.guild.id
                                    },
                                    {
                                        allow: 'VIEW_CHANNEL',
                                        id: member.user.id
                                    },
                                    {
                                        allow: 'VIEW_CHANNEL',
                                        id: staffrole.id
                                    },

                                ]
                            });

                            const welcome = new Discord.MessageEmbed()
                            .setColor(T.blank)
                            .setAuthor('Welcome!', "https://media.discordapp.net/attachments/569219717559222307/807583429997756426/server-icon_1.png")
                            .setDescription(`Welcome to the Faction Leaders Discord. A channel has automatically been created for your faction.`)
                            .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656401881399296/SkullWars_Tickets_Sword.png")

                            try {
                                member.send(welcome);
                            } catch (error) {
                                console.log("Error DM'ing faction leader upon joining fleaders discord.");
                            }    

                            const channelSetup = new Discord.MessageEmbed()
                                .setColor(T.blank)
                                .setAuthor('Welcome!', "https://media.discordapp.net/attachments/569219717559222307/807583429997756426/server-icon_1.png")
                                .setDescription(`Welcome to the Faction Leaders Discord. This channel has automatically been created for you, as you were previously signed up as a Faction Leader. Below are listed a couple commands you're able to use in this channel.`)
                                .addField("Commands:", `➜ \`.add <ID>\``) //\n➜ \`.remove <@USER>\`
                                .setThumbnail("https://media.discordapp.net/attachments/547139643414675466/811656401881399296/SkullWars_Tickets_Sword.png")
                            await channel.send(channelSetup)
                            con.end();
                            return;
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            })
        })
    })





}