const express = require('express');
const router = express.Router();
const passport = require('passport');
const Movie=require('../../models/Movie');


// POST endpoint to create a new movie
router.post('/movies', async (req, res) => {
    try {
        const {
            title,
            year,
            runtime,
            released,
            poster,
            plot,
            fullplot,
            lastupdated,
            type,
            directors,
            imdb,
            cast,
            countries,
            genres,
            tomatoes,
            num_mflix_comments,
            plot_embedding
        } = req.body;

        const newMovie = new Movie({
            title,
            year,
            runtime,
            released,
            poster,
            plot,
            fullplot,
            lastupdated,
            type,
            directors,
            imdb,
            cast,
            countries,
            genres,
            tomatoes,
            num_mflix_comments,
            plot_embedding
        });

        const savedMovie = await newMovie.save();

        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(500).json({ error: 'Error creating movie', details: error.message });
    }
});



// Search for movies
router.get('/movies/search', (req, res) => {
    // Mock logic: return all movies for demonstration
    Movie.find({"title":req.title})
        .then(movie => res.json(movie))
        .catch(err => res.status(500).json({ error: 'Error fetching movies' }));
});

// Get a movie by its ID
router.get('/movies/:id', (req, res) => {
    Movie.findById(req.params.id)
        .then(movie => {
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            res.json(movie);
        })
        .catch(err => res.status(500).json({ error: 'Error fetching movie' }));
});

router.get('/movies/:language',async (req, res) => {
    const language=req.params.language
    try{
        const movie = await Movie.find({ languages: { $in: [language] } });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    }
    catch(err){
        res.status(500).json({ error: 'Error fetching movie' })
    }
})

// Update a movie by its ID
router.put('/movies/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(movie => {
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            res.json(movie);
        })
        .catch(err => res.status(500).json({ error: 'Error updating movie' }));
});

// Delete a movie by its ID
router.delete('/movies/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movie.findByIdAndDelete(req.params.id)
        .then(movie => {
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            res.json({ message: 'Movie deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: 'Error deleting movie' }));
});


module.exports = router;