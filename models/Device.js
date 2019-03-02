const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    // Begin here
    devicename: {
        type: String
    },

    datetime: {
        type: Number,
        trim: true
    },

    filename: {
        type: String,
        trim: true
    },

    id: {
        type: String,
        trim: true
    },

    romtype: {
        type: String,
    },

    size: {
        type: Number
    },

    url: {
        type: String
    },

    version: {
        type: String
    }


});

module.exports = mongoose.model('Device', deviceSchema);