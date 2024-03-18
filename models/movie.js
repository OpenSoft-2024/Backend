const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
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
        type: Object,
        default: {}
    },
    lastupdated: {
        type: Date,
        default: Date.now
    },
    year: Number,
    imdb: {
        type: Object,
        default: {}
    },
    countries: [String],
    tomatoes: {
        type: Object,
        default: {}
    },
    num_mflix_comments: {
        type: Number,
        default: 0
    }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
