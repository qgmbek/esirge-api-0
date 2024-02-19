const mongoose = require('mongoose');

const statesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    capital: { type: String, required: true},
    banner: { type: String, required: true},
    map: { type: String, required: true},
    legislature: { type: String, required: true},
    area: { type: Number, required: true },
    tamga: { type: String, required: true },
    qaghans: { type: String, required: true},
    religion: { type: String, required: true},
    language: { type: String, required: true},
    etymology: { type: String, required: true},
    history: { type: String, required: true},
    administration: { type: String, required: true},
    economy: { type: String, required: true},
});

module.exports = mongoose.model('States', statesSchema);
