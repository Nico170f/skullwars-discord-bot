const mongoose = require('mongoose');
const json = require('./json.js');
const schemas = require('../schemas/index.js');
const settings = require('../settings.json');
const models = {};





exports.models = models;
exports.init = () => {
    const dbOptions = {
        useNewUrlParser: true,
        connectTimeoutMS: 10000,
        useUnifiedTopology: true
    };

    mongoose.connect("mongodb://localhost:27017/test", dbOptions);

    mongoose.connection.on('connected', () => {
        for(let schema in schemas) {
            if(schemas.hasOwnProperty(schema)) {
                models[schema] = mongoose.model(schema, schemas[schema]);
                console.log("\x1b[34mGenerated the " + schema + " model.");
            }
        }
        console.log('\x1b[32mMongoose connection successfully opened!');
    });

    mongoose.connection.on('err', err => {
        console.error(`\x1b[31mMongoose connection error: \n ${err.stack}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('\x1b[31mMongoose connection disconnected');
    });
};

const ensureConnection = () => {
    return mongoose.connection.readyState == 1;
};

/**
 * Updates the settings of a guild
 * @param  {Discord.Guild} guild   The guild to update
 * @param  {Object} options The settings to update
 * @return {Promise}         Resolves once settings have been updated.
 */
exports.updateGuild = (guild, options) => {
    return new Promise((resolve, reject) => {
        if(ensureConnection()) {
            models.Guild.findOne({guildID: guild.id.toString()}).then(async doc => {
                doc = json.merge(doc, options);
                await doc.save();
                resolve();
            }).catch(error => {
                reject(error);
            });
        } else
            reject("\x1b[31mNo connection to mongoDB");
    });
};

/**
 * Retrieve the information stored about a guild
 * @param  {Number} guild The id of the guild to retrieve
 * @return {Promise<mongoose.Document>}       Resolves with the information of the guild, rejects if there is no connection or no info stored about the guild
 */
exports.getGuild = (guild) => {
    return new Promise((resolve, reject) => {
        if(ensureConnection()) {
            models.Guild.findOne({guildID: guild}, (error, doc) => {
                if(error)
                    return reject(error);

                resolve(doc);
            });
        } else
            reject("\x1b[31mNo connection to mongoDB");
    });
};