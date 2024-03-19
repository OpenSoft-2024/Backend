const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: {
        type: String,
        required: true
    },
    history: {
        type: Array,
        required: true
    },
    suggestions: {
        type: Array,
        required: true
    },
    watchlist: {
        type: Array,
        required: true
    },
    favorites: {
        type: Array,
        required: true
    },
    subscription: {
        type: String,
        required: true
    },
    rentals: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Profile', profileSchema);