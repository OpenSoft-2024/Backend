const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    plot: {
        type: String,
        required: true
    },
    genres: {
        type: [String],
        required: true
    },
    runtime: {
        type: Number,
        required: true
    },
    rated: {
        type: String
    },
    cast: {
        type: [String],
        required: true
    },
    num_mflix_comments: {
        type: Number,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    lastupdated: {
        type: Date,
        required: true
    },
    languages: {
        type: [String]
    },
    released: {
        type: Date,
        required: true
    },
    directors: {
        type: [String],
        required: true
    },
    writers: {
        type: [String]
    },
    awards: {
        wins: {
            type: Number
        },
        nominations: {
            type: Number
        },
        text: {
            type: String
        }
    },
    year: {
        type: Number,
        required: true
    },
    imdb: {
        rating: {
            type: Number,
            required: true
        },
        votes: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    },
    countries: {
        type: [String],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    tomatoes: {
        viewer: {
            rating: {
                type: Number,
                required: true
            },
            numReviews: {
                type: Number,
                required: true
            },
            meter: {
                type: Number
            }
        },
        dvd: {
            type: Date
        },
        critic: {
            rating: {
                type: Number
            },
            numReviews: {
                type: Number
            },
            meter: {
                type: Number
            }
        },
        lastUpdated: {
            type: Date
        },
        rotten: {
            type: Number
        },
        production: {
            type: String
        },
        fresh: {
            type: Number
        }
    },
    plot_embedding: {
        type: [Number],
        required: true
    }
});

module.exports = mongoose.model('movie', MovieSchema);