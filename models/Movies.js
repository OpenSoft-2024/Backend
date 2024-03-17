// Define schema for movies collection
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    _id: String,
    plot: String,
    genres: [String],
    runtime: Number,
    cast: [String],
    poster: String,
    title: String,
    fullplot: String,
    languages: [String],
    released: Date,
    directors: [String],
    rated: String,
    awards: {
        wins: Number,
        nominations: Number,
        text: String
    },
    lastupdated: Date,
    year: Number,
    imdb: {
        rating: Number,
        votes: Number,
        id: Number
    },
    countries: [String],
    type: String,
    tomatoes: {
        viewer: {
            rating: Number,
            numReviews: Number,
            meter: Number
        },
        fresh: Number,
        critic: {
            rating: Number,
            numReviews: Number,
            meter: Number
        },
        rotten: Number,
        lastupdated: Date
    },
    num_mflix_comments: Number
});

// Create a model for the movie schema
const Movie = mongoose.model('Movie', movieSchema);

// Export the model
module.exports = Movie;