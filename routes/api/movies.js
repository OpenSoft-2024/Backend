const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Create a movie
router.post('/', async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read - Search movies
router.get('/search', async (req, res) => {
    try {
        // Implement search functionality here
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read - Get movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read - Get movies by language
router.get('/languages/:language', async (req, res) => {
    try {
        // Implement functionality to get movies by language
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read - Get movies by genre
router.get('/genre/:genre', async (req, res) => {
    try {
        // Implement functionality to get movies by genre
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read - Get all-time hits
router.get('/alltimehits', async (req, res) => {
    try {
        // Implement functionality to get all-time hits
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read - Get latest movies
router.get('/latest', async (req, res) => {
    try {
        // Implement functionality to get latest movies
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update - Rating changes (and any other changes) - Admin only
router.put('/:id', async (req, res) => {
    try {
        // Implement functionality to update a movie's rating and other details
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete - Delete all movie related data
router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (movie) {
            res.json({ message: 'Movie deleted successfully' });
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
