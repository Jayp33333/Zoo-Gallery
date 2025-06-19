const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['Mammal', 'Bird', 'Fish', 'Reptile', 'Amphibian'],
        required: true
    },
    description: { type: String, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('Animal', animalSchema);