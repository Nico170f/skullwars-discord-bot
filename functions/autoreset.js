const Discord = require('discord.js');
const mongoose = require('../util/mongoose.js');
const CronJob = require('cron').CronJob;
const fs = require('fs');
const settings = require('../settings.json');
const moment = require('moment');

//const date1 = moment(new Date()).format('DD-MMM-YYYY h:mm')
module.exports = async (Client, member) => {
  const date2 = moment(new Date()).format('DD-MMM-YYYY')
  setTimeout(function() {

//Run this every monday at 00:01:01 //1 1 0 * * Mon    ///*/30 * * * * *
var job = new CronJob('1 1 0 * * Mon', async function() {
  console.log('Weekly staff-reset has been run!');

  await mongoose.models.Profile.updateMany({pointsWeekly: 0})//__{}, {"messages.normalMessages": 0}
  let guildprofile = await mongoose.models.Guild.findOne({guildID: settings.General.Servers.Public});
  let date1 = moment(new Date()).format('DD-MMM-YYYY')
    guildprofile.weekDate = date1;
    await guildprofile.save();
      }, null, true, 'Europe/Copenhagen');

//Run this every 1st at 00:01:01 //1 1 0 1 * *
var job2 = new CronJob('1 1 0 1 * *', async function() {
  console.log('Monthly staff-reset has been run!');
  await mongoose.models.Profile.updateMany({pointsMonthly: 0});
  let guildprofile = await mongoose.models.Guild.findOne({guildID: settings.General.Servers.Public});
  let date1 = moment(new Date()).format('DD-MMM-YYYY')
    guildprofile.monthDate = date1;
    await guildprofile.save();
    }, null, true, 'Europe/Copenhagen');

Client.on("ready", async (message, user, guild) => {

  let guildprofile = await mongoose.models.Guild.findOne({guildID: settings.General.Servers.Public});
  if(!guildprofile) {
    guildprofile = new mongoose.models.Guild({guildID: settings.General.Servers.Public, monthDate: date2, weekDate: date2});
    console.log("Created guild profile!")

  await guildprofile.save();
}

job.start();
console.log("\x1b[34mWeekly staff-reset job started!")
job2.start();
console.log("\x1b[34mMonthly staff-reset job started!")
})
}, 3500)
}