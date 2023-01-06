const Discord = require("discord.js")
const ms = require("ms");
const fs = require("fs")
const mongoose = require('../util/mongoose.js');
const settings = require("../settings.json");
const T = settings.General.Theme;
const G = require('../functions/cmdupdate.js');

exports.run = async (client, message, args) => { //eslint-no-unused-vars
  G.updateGuild();

  const staffProfile = await mongoose.models.Profile.findOne({
    guildID: settings.General.Servers.Public,
    userID: message.author.id
  });
  if (!settings.General.PermissionBypass.includes(message.author.id)) {
    let notStaff = new Discord.MessageEmbed()
      .setDescription(`You are not a staff member.`)
      .setColor(T.blank)
    if (!staffProfile) return message.channel.send(notStaff);


    let notHigh = new Discord.MessageEmbed()
      .setDescription(`Your staff rank does not allow this command.`)
      .setColor(T.red)
      if (staffProfile.rank < 7) return message.channel.send(notHigh)
  }


  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription(`${message.author} used the say command.`)
  if(message.guild.id == settings.General.Servers.Public) modLogs.send(embed24)

  let channel;
  let embed;
  let ping;
  let content;
  let color = T.blank;
  let filter = m => m.author.id === message.author.id;
  let invalid = new Discord.MessageEmbed()
  .setDescription(`Command timeout.`)
  .setColor(T.blank)

  //Question 1
  let whereEmbed = new Discord.MessageEmbed()
    .setDescription(`Where would you like the message posted?`)
    .setColor(T.blank)
  message.channel.send(whereEmbed).then(() => {
    message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time']
      })
      .then(message => {
        message = message.first()
        if (message.mentions.channels.first()) {
          channel = message.mentions.channels.first();

          //Question 2
          let embedEmbed = new Discord.MessageEmbed()
            .setDescription(`Should this message be inside an embed? Please anser with: \`Yes/No\``)
            .setColor(T.blank)
          message.channel.send(embedEmbed).then(() => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 30000,
                errors: ['time']
              })
              .then(message => {
                message = message.first()
                if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                  embed = true;
                } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                  embed = false;
                } else {
                  return message.channel.send(invalid);
                }

                //Question 3
                let pingEmbed = new Discord.MessageEmbed()
                  .setDescription(`Should a ping \`(@everyone)\` be sent before the message is posted? Please anser with: \`Yes/No\``)
                  .setColor(T.blank)
                message.channel.send(pingEmbed).then(() => {
                  message.channel.awaitMessages(filter, {
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    })
                    .then(message => {
                      message = message.first()
                      if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                        ping = true;
                      } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                        ping = false;
                      } else {
                        return message.channel.send(invalid);
                      }


                      //Question 4
                      let pingEmbed = new Discord.MessageEmbed()
                        .setDescription(`Please paste the message you want to post.`)
                        .setColor(T.blank)
                      message.channel.send(pingEmbed).then(() => {
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time']
                          })
                          .then(message => {
                            message = message.first()
                            content = message.content;



                            //Question 5
                            let doneEmbed = new Discord.MessageEmbed()
                              .setColor("GREEN")
                              .setDescription(`Successfully posted message in ${channel}!`)
                            let pingEmbed = new Discord.MessageEmbed()
                              .setDescription(`Would you like to preview the message before posting it? \`Yes/No\``)
                              .setColor(T.blank)
                            message.channel.send(pingEmbed).then(() => {
                              message.channel.awaitMessages(filter, {
                                  max: 1,
                                  time: 30000,
                                  errors: ['time']
                                })
                                .then(async message => {
                                  message = message.first()
                                  if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                    let msg;
                                    if (ping) message.channel.send(`@everyone`);
                                    if (embed) {
                                      let finishedEmbed = new Discord.MessageEmbed()
                                        .setDescription(content)
                                        .setColor(T.blank)
                                      msg = await message.channel.send(finishedEmbed);
                                    } else {
                                      msg = await message.channel.send(content);
                                    }
                                    if (embed) {

                                      let pingEmbed = new Discord.MessageEmbed()
                                        .setDescription(`Do you want to change the embed color? \`Yes/No\``)
                                        .setColor(T.blank)
                                      message.channel.send(pingEmbed).then(() => {
                                        message.channel.awaitMessages(filter, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                          })
                                          .then(message => {
                                            message = message.first()
                                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {


                                              let pingEmbed = new Discord.MessageEmbed()
                                                .setDescription(`What should the embed color be changed to? \`#XXXXXX\`\n➜ [HEX Colors](https://www.color-hex.com/)`)
                                                .setColor(T.blank)
                                              message.channel.send(pingEmbed).then(() => {
                                                message.channel.awaitMessages(filter, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time']
                                                  })
                                                  .then(message => {
                                                    message = message.first()

                                                    try {
                                                      let newembed = new Discord.MessageEmbed()
                                                        .setColor(message.content)
                                                        .setDescription(content)
                                                      msg.edit(newembed)
                                                      color = message.content;

                                                      let pingEmbed = new Discord.MessageEmbed()
                                                        .setDescription(`Preview has been updated. Should this message be posted in ${channel}? \`Yes/No\``)
                                                        .setColor(T.blank)
                                                      message.channel.send(pingEmbed).then(() => {
                                                        message.channel.awaitMessages(filter, {
                                                            max: 1,
                                                            time: 30000,
                                                            errors: ['time']
                                                          })
                                                          .then(message => {
                                                            message = message.first()

                                                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {

                                                              if (ping) channel.send(`@everyone`);
                                                              if (embed) {
                                                                let finishedEmbed = new Discord.MessageEmbed()
                                                                  .setDescription(content)
                                                                  .setColor(color)
                                                                channel.send(finishedEmbed);
                                                                return message.channel.send(doneEmbed);
                                                              } else {
                                                                channel.send(content);
                                                                return message.channel.send(doneEmbed);
                                                              }
                                                            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                                              let cancel = new Discord.MessageEmbed()
                                                                .setDescription("Operation stopped.")
                                                              return message.channel.send(cancel);

                                                            } else {
                                                              return message.channel.send(invalid);
                                                            }

                                                          })
                                                          .catch(collected => {
                                                            return message.channel.send(invalid);
                                                          });
                                                      })
                                                    } catch (err) {
                                                      let error = new Discord.MessageEmbed()
                                                        .setColor(T.red)
                                                        .setDescription("Error using color: " + message.content)
                                                      return message.channel.send(error)
                                                    }
                                                  })
                                                  .catch(collected => {
                                                    return message.channel.send(invalid);
                                                  });
                                              })
                                            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {

                                              //Question 6
                                              let doneEmbed = new Discord.MessageEmbed()
                                                .setColor("GREEN")
                                                .setDescription(`Successfully posted message in ${channel}!`)
                                              let pingEmbed = new Discord.MessageEmbed()
                                                .setDescription(`Should this message be posted in ${channel}? \`Yes/No\``)
                                                .setColor(T.blank)
                                              message.channel.send(pingEmbed).then(() => {
                                                message.channel.awaitMessages(filter, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time']
                                                  })
                                                  .then(message => {
                                                    message = message.first()

                                                    if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {

                                                      if (ping) channel.send(`@everyone`);
                                                      if (embed) {
                                                        let finishedEmbed = new Discord.MessageEmbed()
                                                          .setDescription(content)
                                                          .setColor(color)
                                                        channel.send(finishedEmbed);
                                                        return message.channel.send(doneEmbed);
                                                      } else {
                                                        channel.send(content);
                                                        return message.channel.send(doneEmbed);
                                                      }
                                                    } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                                      let cancel = new Discord.MessageEmbed()
                                                        .setDescription("Operation stopped.")
                                                      return message.channel.send(cancel);

                                                    } else {
                                                      return message.channel.send(invalid);
                                                    }
                                                  })
                                                  .catch(collected => {
                                                    return message.channel.send(invalid);
                                                  });
                                              })

                                            } else {
                                              return message.channel.send(invalid);
                                            }
                                          })
                                          .catch(collected => {
                                            return message.channel.send(invalid);
                                          });
                                      })
                                    } else {
                                      //Question 6
                                      let doneEmbed = new Discord.MessageEmbed()
                                        .setColor("GREEN")
                                        .setDescription(`Successfully posted message in ${channel}!`)
                                      let pingEmbed = new Discord.MessageEmbed()
                                        .setDescription(`Should this message be posted in ${channel}? \`Yes/No\``)
                                        .setColor(T.blank)
                                      message.channel.send(pingEmbed).then(() => {
                                        message.channel.awaitMessages(filter, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                          })
                                          .then(message => {
                                            message = message.first()

                                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {

                                              if (ping) channel.send(`@everyone`);
                                              if (embed) {
                                                let finishedEmbed = new Discord.MessageEmbed()
                                                  .setDescription(content)
                                                channel.send(finishedEmbed);
                                                return message.channel.send(doneEmbed);
                                              } else {
                                                channel.send(content);
                                                return message.channel.send(doneEmbed);
                                              }
                                            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                              let cancel = new Discord.MessageEmbed()
                                                .setDescription("Operation stopped.")
                                              return message.channel.send(cancel);

                                            } else {
                                              return message.channel.send(invalid);
                                            }
                                          })
                                          .catch(collected => {
                                            return message.channel.send(invalid);
                                          });
                                      })

                                    }
                                  } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                    if (ping) channel.send(`@everyone`)
                                    if (embed) {
                                      let finishedEmbed = new Discord.MessageEmbed()
                                        .setDescription(content)
                                        .setColor(T.blank)
                                      channel.send(finishedEmbed);
                                      return message.channel.send(doneEmbed);
                                    } else {
                                      channel.send(content)
                                      return message.channel.send(doneEmbed);
                                    }
                                  } else {
                                    return message.channel.send(invalid);
                                  }
                                })
                                .catch(collected => {
                                  return message.channel.send(invalid);
                                });
                            })
                          })
                          .catch(collected => {
                            return message.channel.send(invalid);
                          });
                      })
                    })
                    .catch(collected => {
                      return message.channel.send(invalid);
                    });
                })
              })
              .catch(collected => {
                return message.channel.send(invalid);
              });
          })
        } else {
          return message.channel.send(invalid);
        }
      })
      .catch(collected => {
        return message.channel.send(invalid);
      });
  })




/*  let argsresult;
  let = mChannel = message.mentions.channels.first();

  let embed1 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("Please mention a channel!")
  if (!mChannel) return message.channel.send(embed1);

  let embed2 = new Discord.MessageEmbed()
    .setColor(T.red)
    .setDescription("Your message is too long. Max \`2048\` characters.")
  if (!message.content.length > 2030) return message.channel.send(embed2);

  let embed3 = new Discord.MessageEmbed()
    .setColor(T.green)
    .setDescription("Message sent!")
  message.channel.send(embed3)



  argsresult = args.slice(1).join(" ")
  let saymessage = new Discord.MessageEmbed()
    .setColor(T.main)
    .setDescription(argsresult)
  mChannel.send(saymessage)

  let modLogs = message.guild.channels.cache.find(c => c.id === settings.Channels.ModLogs)
  let embed24 = new Discord.MessageEmbed()
    .setColor(T.blank)
    .setDescription(`${message.author} used say command to say: ${argsresult}`)
  modLogs.send(embed24)
*/

}
exports.help = {
  name: 'say',
  aliases: ['embed', 'ac'],
}