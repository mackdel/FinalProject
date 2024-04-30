const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    stateCode: {
        type: String,
        require: true,
        unique: true
    },
    funfacts: [String]
});

module.exports = mongoose.model('State', stateSchema);