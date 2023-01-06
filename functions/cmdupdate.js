const mongoose = require('../util/mongoose.js');
const Discord = require('discord.js');
const settings = require('../settings.json');

    async function updateGuild() {
        let guildStats = await mongoose.models.Guild.findOne({
            guildID: settings.General.Servers.Public
        });
        guildStats.stats.commands += 1;
        await guildStats.save();
    }

module.exports = { updateGuild };