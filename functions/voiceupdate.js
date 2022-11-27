const Discord = require('discord.js');
const settings = require('../settings.json');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const mongoose = require('../util/mongoose.js');
const moment = require('moment');
const T = settings.General.Theme;
const debug = require('../debugs.json');
const d = debug.VoiceActivty;

module.exports = (Client, message) => {



    const ActivityJob = new CronJob(settings.Points.voiceCallActivity.timer, async function () {
        if(d) console.log("ActivityJob run")
        if(d) console.log(userArray)
        for (const userid in userArray) {
          if (!CheckStatus(userArray[userid]))
            continue;
      
          try {
            let staffProfile = await mongoose.models.Profile.findOne({
              userID: userid
            });
            if (staffProfile) {
              let point = settings.Points.voiceCallActivity.points;
              staffProfile.pointsTotal += point;
              staffProfile.pointsWeekly += point;
              staffProfile.pointsMonthly += point;
              staffProfile.activity += 1;
              await staffProfile.save();
              if(d) console.log("updated: " + userid)
            }
          } catch (err) {
            console.log(err)
          }
        }
      }, null, true, 'Europe/Copenhagen');
      
      
      function CheckStatus(x) {
        //console.log(x);
        //console.log(userChannels[x]);
        return userChannels[x] >= settings.Points.voiceCallActivity.minumumInChannel;
      }
      
      let userArray = {};
      let userChannels = {};
      Client.on('voiceStateUpdate', async (oldMember, newMember) => {
          if(newMember.guild.id == settings.General.Servers.Leaders) return;
          if(newMember.guild.id == settings.General.Servers.Mentor) return;
          if(settings.Points.voiceCallActivity.ignoreChannelID.includes(newMember.channelID)) return;

      
        let userid = newMember.id;
        if (newMember.selfVideo == true) return;
        if (oldMember.selfVideo == true) return;
        if (newMember.serverMute == true) return;
        if (oldMember.serverMute == true) return;
      
      
        //  if (newMember.selfMute == true && newMember.selfDeaf == false) {
        //    //console.log("user muted")
        //    //console.log(userArray);
        //  }
        //  if (oldMember.selfMute == true && oldMember.selfDeaf == false) {
        //    //console.log("user unmuted")
        //    //console.log(userArray);
        //  }
      
      
      
        const changedChannel = newMember.channelID != oldMember.channelID;
        if (newMember.channelID && (oldMember.channelID == null || changedChannel)) {
          if (changedChannel) {
            const OldChannel = userChannels[oldMember.channelID] - 1;
            userChannels[oldMember.channelID] = OldChannel < 0 ? 0 : OldChannel;
          }
      
      
          if (newMember.selfDeaf == false) {
            userArray[userid] = newMember.channelID;
            userChannels[newMember.channelID] = (userChannels[newMember.channelID] || 0) + 1;
            //console.log("joined channel")
            //console.log(userArray);
            return;
          }
          //console.log("joined but is muted")
          //console.log(userArray);
          return;
        }
      
        if (oldMember.channelID && newMember.channelID == null) {
          if (userArray.hasOwnProperty(userid)) {
            if (oldMember.channelID == userArray[userid]) {
              const OldChannel = userChannels[oldMember.channelID] - 1;
              userChannels[oldMember.channelID] = OldChannel < 0 ? 0 : OldChannel;
            }
            delete userArray[userid];
            //console.log(userArray);
          }
          return;
        }
      
      
      
        if (newMember.selfDeaf == true) {
          //console.log("user is now def")
          if (oldMember.channelID == userArray[userid]) {
            const OldChannel = userChannels[oldMember.channelID] - 1;
            userChannels[oldMember.channelID] = OldChannel < 0 ? 0 : OldChannel;
          }
          delete userArray[userid];
          //console.log(userArray);
          return;
        }
      
        if (oldMember.selfDeaf == true) {
          //console.log("user is not def")
          userChannels[newMember.channelID] = (userChannels[newMember.channelID] || 0) + 1;
          userArray[userid] = newMember.channelID;
          //console.log(userArray);
          return;
        }
      })

}