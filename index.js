const Discord = require("discord.js")
const Client = new Discord.Client();
const s = require('./settings.json');
const c  = require('./startup.json');

if(c.startup) require('./functions/startup')(Client);
if(c.reactionadd) require('./functions/reactionadd')(Client);
if(c.autoreset) require('./functions/autoreset')(Client);
if(c.messageevents) require('./functions/messageevents')(Client);
if(c.voiceupdate) require('./functions/voiceupdate')(Client);
if(c.fleaderadd) require('./functions/fleaderadd')(Client);
if(c.factionstop) require('./functions/factionstop')(Client);
if(c.testing) require('./functions/testing')(Client);


Client.db = require('./util/mongoose');
Client.db.init();
Client.login(s.General.Key)