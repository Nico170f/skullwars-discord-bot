const mongoose = require('mongoose');
module.exports = mongoose.Schema({
    guildID: String,
    authorID: String,
    authorTAG: String,
    messageID: String,
    suggestion: String,
    embedURL: String

});
