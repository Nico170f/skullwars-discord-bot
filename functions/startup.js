const Discord = require('discord.js');
const settings = require('../settings.json');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const mongoose = require('../util/mongoose.js');
const moment = require('moment');



module.exports = (Client, message) => {

    let string = "123 dsa 2asd";
    console.log(parseInt(string))




    process.on('uncaughtException', function (err) {
        console.log('Caught exception: ' + err);
        let date1 = moment(new Date()).format('DD-MMM-YYYY h:mm A')
        fs.appendFile(`./errlog.txt`, `Error:\n${date1}\n\n` + err, function (err) {
            if (err) {
                console.log(err)
            }
        });
    });

    const startjob = new CronJob('1 1 */12 * * *', async function () {
        Client.user.setPresence({
                activity: {
                    name: 'play.skullwars.net'
                },
                status: 'online'
            })
            .catch(console.error);
    }, null, true, 'Europe/Copenhagen');


    //Loading events
    fs.readdir("./events/", (err, files) => {
        console.log(`\x1b[36mLoading events...`)
        if (err) return console.error("\x1b[31m" + err);
        files.forEach((file, i) => {
            const event = require(`../events/${file}`);
            let eventName = file.split(".")[0];
            console.log(`\x1b[34m${i + 1}. ${eventName} loaded.`);
            Client.on(eventName, event.bind(null, Client));
        });
        console.log(`\x1b[32mAll events have been loaded!`)
    });


    //Loading commands
    Client.commands = new Discord.Collection();
    Client.aliases = new Discord.Collection();
    fs.readdir("./commands/", (err, files) => {
        console.log(`\x1b[36mLoading commands...`)
        if (err) return console.error("\x1b[31m" + err);
        files.forEach((file, i) => {
            if (!file.endsWith(".js")) return;
            let cmd = require(`../commands/${file}`);
            let cmdFileName = file.split(".")[0];
            Client.commands.set(cmd.help.name, cmd);
            console.log(`\x1b[34m${i + 1}. ${cmdFileName} is loaded.`);
            if (cmd.help.aliases) {
                cmd.help.aliases.forEach(alias => {
                    Client.aliases.set(alias, cmd.help.name);
                });
            };
        });
        console.log(`\x1b[32mAll commands have been loaded!`)
    });



    //Logging if the bot is online.
    Client.on("ready", async (message, user) => {
        console.log(`\x1b[32mDiscord Application Ready.`);
        startjob.start();
        Client.user.setStatus('online').catch(console.error);
        Client.user.setPresence({
            activity: {
                name: 'play.skullwars.net'
            },
            status: 'online'
        }).catch(console.error);

        if (settings.Support.SetupMode === true) {
            console.log("\x1b[31mSetup is currently true, please disable to fetch ticket message.")
        } else {
            const fetchChannel = Client.channels.cache.get(settings.Support.TicketChannelID);
            if (!fetchChannel) return console.log("\x1b[31mTicket support channel not found.");
            const fetchMsg = fetchChannel.messages.fetch(settings.Support.TicketMessageID)
            if (!fetchMsg) return console.log("\x1b[31mTicket support message not found.");
        }

        setTimeout(async function () {

            var Promise = require('bluebird');
            var mongoose = Promise.promisifyAll(require('mongoose'));
            let finalResults = [];

            await await console.log("\x1b[36mTrying to fetch suggestions...")
            var promises = await mongoose.models.Suggest.find({
                guildID: settings.General.Servers.Public
            }, function (err, results) {
                results.forEach(function (element) {
                    finalResults.push(element.messageID);
                    console.log("\x1b[35mAdded ➜  " + element.messageID)
                });
            });
            setTimeout(async function () {
            Promise.all(promises).then(async function () {
                var suggestionChannel = Client.channels.cache.get(settings.Channels.Suggestions);
                if (!suggestionChannel) return console.log("\x1b[31mSuggestion channel not found!");

                console.log(`\x1b[33mFound ${finalResults.length} suggestions:`)
                console.log(finalResults)

                let counter = 1;
                finalResults.forEach(async function (e) {
                    try {
                        await suggestionChannel.messages.fetch(e)
                        console.log(`\x1b[36m(${counter}) Loaded suggestion: ` + e)
                        counter++;
                    } catch (error) {
                        if (error.code == 10008) {
                            console.log(`\x1b[31m(${counter}) Suggestion message not found: ` + e)
                            await mongoose.models.Suggest.deleteOne({messageID: e.toString()});
                            //console.log("\x1b[34mDeleted suggestion profile for: " + e)
                            counter++;
                        } else {
                            console.log(error)
                        }

                    }


                });

            }).error(console.error)
        }, 2000)
        }, 5000)

    });
}