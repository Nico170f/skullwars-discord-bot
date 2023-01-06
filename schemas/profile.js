const mongoose = require('mongoose');
module.exports = mongoose.Schema({
    guildID: String,
    userID: String,
    userTag: String,
    IGN: String,
    dateAdded: String,
    moderation:{
        mutes:{
            type: Number,
            default: 0
        },
        kicks:{
            type: Number,
            default: 0
        },
        bans:{
            type: Number,
            default: 0
        },
        mutes:{
            type: Number,
            default: 0
        },
        tickets: {
            type: Number,
            default: 0
        },
        activity: {
            type: Number,
            default: 0
        }
    },
    messages:{
        normalMessages:{
            type: Number,
            default: 0
        },
        ticketMessages:{
            type: Number,
            default: 0
        }
    },
    rank: {
        type: Number,
        default: 1
    },
    pointsTotal:{
        type: Number,
        default: 0

    },
    pointsWeekly:{
        type: Number,
        default: 0

    },
    pointsMonthly:{
        type: Number,
        default: 0
    }
});
