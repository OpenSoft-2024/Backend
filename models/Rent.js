const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RentSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie', // Assuming 'Movie' is the name of the model for movies
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' is the name of the model for users
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    }
});

module.exports = Rent = mongoose.model('rents', RentSchema);
