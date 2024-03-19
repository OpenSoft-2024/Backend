const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    history: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
          }],
        required: true
    },
    suggestions: {
        type: Array,
        required: true
    },
    watchlist: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
          }],
        required: true
    },
    favorites: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
          }],
        required: true
    },
    subscription: {
        
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subscription',
            required: true
         
    },
    rentals: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
          }],
        required: true
    }
});

module.exports = mongoose.model('Profile', profileSchema);