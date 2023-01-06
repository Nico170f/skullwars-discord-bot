const mongoose = require('mongoose');
module.exports = mongoose.Schema({
    guildID: String,
    userID: String,
    userTag: String,
    Muted: Boolean,
    messages: {
        type: Number,
        default: 0
    }
    
});
