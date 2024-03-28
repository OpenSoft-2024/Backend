const express = require('express');
const router = express.Router();
const Movie = require('../../models/Movie');

router.get('/', async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
        return res.status(400).json({ message: 'Please provide a search query.' });
    }

    try {
        // Define the aggregation pipeline
        const agg = [
            {
                $match: { $text: { $search: q } }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    score: { $meta: 'textScore' }
                }
            },
            {
                $sort: { score: { $meta: 'textScore' } }
            },
            {
                $limit: 10
            }
        ];

        // Execute the aggregation pipeline
        const results = await Movie.aggregate(agg);

        res.status(200).json({ message: 'Search results', results });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
