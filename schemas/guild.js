const mongoose = require('mongoose');
module.exports = mongoose.Schema({
    guildID: String,
    monthDate: String,
    weekDate: String,
    ticket:{
        type: Number,
        default: 0
    },
    uniqueJoins: [],
    stats: {
        commands:{
            type: Number,
            default: 0   
        },
        
        messages:{
            type: Number,
            default: 0   
        },
        ftopUpdates:{
            type: Number,
            default: 0   
        }
    }
});
