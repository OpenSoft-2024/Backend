const express = require('express');
const router = express.Router();
const Rent = require('../models/Rent');

// Create a rent
router.post('/create', async (req, res) => {
    try {
        const { movieId, duration, userId } = req.body;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + duration);
        
        const rent = new Rent({
            movieId,
            userId,
            expiryDate
        });

        await rent.save();
        res.status(201).json(rent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Read rents by userID
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const rents = await Rent.find({ userId });
        res.json(rents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Read a single rent by ID
router.get('/:id', async (req, res) => {
    try {
        const rent = await Rent.findById(req.params.id);
        if (!rent) {
            return res.status(404).json({ message: 'Rent not found' });
        }
        res.json(rent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete expired rents
router.delete('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await Rent.deleteMany({ userId });
        res.json({ message: 'Rents deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
