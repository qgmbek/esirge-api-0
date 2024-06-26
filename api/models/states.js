const mongoose = require('mongoose');

const statesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    coverImage: { type: String},
    name: { type: String, required: true },
    capital: { type: String, required: true},
    banner: { type: String},
    map: { type: String, required: true},
    legislature: { type: String, required: true},
    area: { type: Number, required: true },
    tamga: { type: String, required: true },
    qaghans: { type: String, required: true},
    religion: { type: String, required: true},
    language: { type: String, required: true},
    etymology: { type: String},
    history: { type: String},
    administration: { type: String},
    economy: { type: String},
});

module.exports = mongoose.model('States', statesSchema);

