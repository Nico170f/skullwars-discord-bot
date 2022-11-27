const Discord = require('discord.js');
const os = require('../settings.json');
const settings = require('../fsettings.json');
const debug = require('../debugs.json');
const d = debug.FactionTop;
const fs = require('fs');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const T = os.General.Theme;
const mysql = require('mysql');
const Canvas = require('canvas')
const ms = require("ms");
const mongoose = require('../util/mongoose.js');


const {
    registerFont,
    createCanvas
} = require('canvas')
registerFont('./fonts/Oxanium-Regular.ttf', {
    family: 'Oxanium'
})
registerFont('./fonts/Oxanium-Bold.ttf', {
    family: 'OxaniumB'
})

let cInfo = os.Database.MySQL;
var con = mysql.createConnection({
    host: cInfo.host,
    user: cInfo.user,
    password: cInfo.password,
    database: cInfo.database
});
var table = cInfo.FTopTable;

module.exports = (Client, message) => {

    Client.on("ready", () => {

        if (settings.FtopUpdates.ImageFTOP.enabled == false && settings.FtopUpdates.MessageFTOP.enabled == false)
            return console.log("\x1b[31mNo Factionstop update modules are enabled.");

        if (settings.FtopUpdates.Updates.CurrentlyEnabled == true) {
            console.log("\x1b[32mFactionsTop updates enabled. Starting Functions...")

            CheckImageUpdate()
            CheckMessageUpdate();

        } else {

            let autoEnable = settings.FtopUpdates.Updates.AutoEnable;
            if (autoEnable == "") return console.log("\x1b[31mThe AutoEnable schedule has not been set, functions stopped.");
            console.log("\x1b[34mFactionsTop updates are currently disabled, waiting for timer. (\x1b[36m" + autoEnable + "\x1b[34m)");

            const AutoEnableJob = new CronJob(autoEnable, async function () {
                console.log("\x1b[32mFactionsTop update schedules have now been enabled!");
                console.log("\x1b[32mStarting functions...");
                AutoEnableJob.stop();

                AutoEnableFTOP();
                CheckImageUpdate();
                CheckMessageUpdate();

            }, null, true, 'Europe/Copenhagen');
        }
    });

    function CheckImageUpdate() {
        if (settings.FtopUpdates.ImageFTOP.enabled == true) {
            let cfgImgFtopChannel = settings.FtopUpdates.ImageFTOP.Channels.SpamChannel;
            let cfgImgFtopSpamChannel = settings.FtopUpdates.ImageFTOP.Channels.SingleChannel;
            if (cfgImgFtopChannel == "" && cfgImgFtopSpamChannel == "") {
                console.log("\x1b[31mImageFTOP is eanbled, but is yes to be configured. Please set atleast one of the two channels in the config.")
            } else {
                ImageUpdate();
                console.log("\x1b[36mStarted ImageFTOP Function!")
            }
        }
    }

    function CheckMessageUpdate() {
        if (settings.FtopUpdates.MessageFTOP.enabled == true) {
            let cfgMsgFtopChannel = settings.FtopUpdates.MessageFTOP.MessageInfo.ChannelID;
            let cfgMsgFtopMsg = settings.FtopUpdates.MessageFTOP.MessageInfo.MessageID;
            if (cfgMsgFtopChannel != "" && cfgMsgFtopMsg != "") {
                MessageUpdate();
                console.log("\x1b[36mStarted MessageFTOP Function!")
            } else {
                console.log(`\x1b[31mMessageFTOP Module is enabled, but is yet to be configured. Please use ".ftop setup" to complete the config setup. `);
            }
        }
    }

    let Sdate = settings.FtopUpdates.MapProgress.startDate;
    let Edate = settings.FtopUpdates.MapProgress.endDate;
    var start = new Date(Sdate.year, Sdate.month - 1, Sdate.day, Sdate.hour, Sdate.minute); // Jan 1, 2015
    var end = new Date(Edate.year, Edate.month - 1, Edate.day, Edate.hour, Edate.minute); // August 24, 2021
    //?new Date(year, month, day, hours, minutes, seconds, milliseconds)


    function ImageUpdate() {
        let counter = 0;
        con.connect(async function (err) {
            function checkDate1() {
                today = new Date(),
                    timerProcent = Math.round(((today - start) / (end - start)) * 100);
                let timeoutTimer = settings.FtopUpdates.UpdateTimer.UpdateTimeout;

                if (timerProcent >= 100) {
                    counter = 1;
                    console.log("\x1b[31mFactionsTop progress has reached 100%")
                    console.log("\x1b[34mContinuting to send ImageUpdates for: " + timeoutTimer + "...")

                    setTimeout(function () {
                        ImageUpdateJob.stop()
                        console.log("\x1b[36mUpdates have automatically been stopped after: " + timeoutTimer + "!")
                        console.log("\x1b[32mAll tasks have been ended.")
                    }, ms(timeoutTimer));
                    return;
                }
            }

            const ImageUpdateJob = new CronJob(settings.FtopUpdates.UpdateTimer.UpdateSchedule, async function () {
                if (counter == 0) {
                    checkDate1();
                }
                today = new Date(),
                    timerProcent = Math.round(((today - start) / (end - start)) * 100);

                if(d) console.log('\x1b[34mRunning "ImageUpdateJob" schedule!');
                con.query(`SELECT Name, Value FROM ${table}`, async function (err, result, rows) {
                    try {
                        if (!result) {
                            console.log(`\x1b[31mDatabase error: Value = 0. Aborting FTOP update.`);
                        } else {
                            const canvas = Canvas.createCanvas(1572 / 2, 1800 / 2);
                            const ctx = canvas.getContext('2d');
                            const background = await Canvas.loadImage('./images/Finished.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                            ctx.strokeStyle = 'rgba(47, 183, 7, 0.6)'
                            ctx.beginPath()
                            ctx.lineWidth = 23 / 2
                            ctx.lineTo(83 / 2, 1781 / 2)

                            let newProcent;
                            if (timerProcent > 100) {
                                newProcent = 100
                            } else {
                                newProcent = timerProcent
                            }

                            ctx.lineTo(((newProcent * 704.5) / 100) + 41.5, 1781 / 2)
                            ctx.stroke()
                            ctx.fill()
                            let newArray = [];
                            result.forEach(function (Data) {
                                newArray.push({
                                    Name: Data.Name.slice(0, 9),
                                    Value: parseInt(Data.Value)
                                })
                            })

                            newArray.sort(function (a, b) {
                                return b.Value - a.Value
                            });

                            let pos = 1;
                            let fillText1 = 280;
                            newArray.forEach(function (Data) {
                                ctx.font = 'bold 40px sans-serif';
                                ctx.fillStyle = '#310000';
                                ctx.fillText(`#${pos}`, 70, fillText1);
                                ctx.font = '40px Oxanium';
                                ctx.fillStyle = '#310000';
                                ctx.fillText(Data.Name, 170, fillText1)
                                ctx.fillText("$" + numberWithCommas(Data.Value), 387.5, fillText1);
                                fillText1 += 50;
                                pos++;
                            })


                            const ftopChannel = Client.channels.cache.get(settings.FtopUpdates.ImageFTOP.Channels.SingleChannel);
                            const deleteMessages = await ftopChannel.messages.fetch({
                                limit: 10
                            })
                            deleteMessages.forEach(msg => {
                                if (msg.author.bot) msg.delete()
                            });

                            if(d) console.log(`\x1b[34mCreating FTOP image...`)
                            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'ftop-image.png');

                            await ftopChannel.send(attachment)
                            const ftopSpam = Client.channels.cache.get(settings.FtopUpdates.ImageFTOP.Channels.SpamChannel);
                            const spamMessage = ftopSpam.send(attachment).then((msg) => {
                                console.log("\x1b[42m\x1b[30mSuccesfully updated ImageFTOP!\u001b[0m")
                            })
                        }
                    } catch (err) {
                        console.error(err)
                    }
                })

                let ftopCount = await mongoose.models.Guild.findOne({
                    guildID: os.General.Servers.Public
                });
                ftopCount.stats.ftopUpdates += 1;
                await ftopCount.save();
            })
            ImageUpdateJob.start();
        })
    }

    function MessageUpdate() {
        con.connect(function (err) {

            const MessageUpdateJob = new CronJob(settings.FtopUpdates.UpdateTimer.UpdateSchedule, async function () {
                if(d) console.log('\x1b[34mRunning "MessageUpdate" schedule!');
                con.query(`SELECT Name, Value FROM ${table}`, function (err, result, rows) {
                    if (err) throw err;
                    try {
                        if (result[0].Value === "" || !result[0].Value) return console.log(`\x1b[31mDatabase error. Aborting FTOP update. `)

                        let newProcent;
                        today = new Date(),
                            timerProcent = Math.round(((today - start) / (end - start)) * 100);
                        if (timerProcent > 100) {
                            newProcent = 100
                        } else {
                            newProcent = timerProcent
                        }

                        let newArray = [];
                        result.forEach(function (Data) {
                            newArray.push({
                                Name: Data.Name.slice(0, 9),
                                Value: parseInt(Data.Value)
                            })
                        })

                        newArray.sort(function (a, b) {
                            return b.Value - a.Value
                        }).then

                        let FactionString = "";
                        let FactionValue = "";
                        let FactionPlacement = 1;
                        for (let val of newArray) {
                            FactionString = FactionString + `\n**${FactionPlacement}.** ` + val.Name;
                            FactionValue = FactionValue + `\n$` + numberWithCommas(val.Value);
                            FactionPlacement++;
                        }

                        const embednew = new Discord.MessageEmbed()
                            .setAuthor('Zanak - Factions Top', "https://media.discordapp.net/attachments/569219717559222307/807583429997756426/server-icon_1.png")
                            .setColor(T.main)
                            .setDescription(`Showing top Factions from __Zanak__! *Factions Top \nis updated every ~5 minutes.*\n\nMap Progress: \`${newProcent}%\``)
                            .addField("Faction:", FactionString, true)
                            .addField("Value:", FactionValue, true)
                            .setFooter('Updated at')
                            .setThumbnail("https://media.discordapp.net/attachments/569219717559222307/807583429997756426/server-icon_1.png")
                            .setTimestamp()

                        const ftopChannel = Client.channels.cache.get(settings.FtopUpdates.MessageFTOP.MessageInfo.ChannelID);
                        ftopChannel.messages.fetch(settings.FtopUpdates.MessageFTOP.MessageInfo.MessageID).then(msg => {
                            msg.edit(embednew)
                        })
                        if(d) console.log("\x1b[42m\x1b[30mSuccesfully updated MessageFTOP!\u001b[0m")
                    } catch (err) {
                        console.error(err)
                    }
                })
            }, null, true, 'Europe/Copenhagen');
            MessageUpdateJob.start();
        })
    }


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function AutoEnableFTOP() {
        fs.readFile("./settings.json", "utf8", function (err, data) {
            var setting = JSON.parse(data);
            setting.FtopUpdates.Updates.CurrentlyEnabled = true;
            var write = JSON.stringify(setting, null, 2);
            fs.writeFileSync("./settings.json", write);
            console.log("\x1b[34mUpdated bot config! { \x1b[36m\"CurrentlyEnabled\": true \x1b[34m}")
        })
    }


}