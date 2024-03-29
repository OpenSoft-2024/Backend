const express = require('express');
const router = express.Router();

const movies = require("../../models/Movie");

// Define a route handler for GET requests to /api/search
router.get('/', async (req, res) => {
    const { q } = req.query;

    // Check if the search query is provided
    if (!q || q.trim().length === 0) {
        return res.status(400).json({ message: 'Please provide a search query.' });
    }

    try {

        // Define the aggregation pipeline for text search
        const pipeline = [
            {
                $search: {
                  "index": "title", // optional, defaults to "default"
                  "autocomplete": {
                    'path': 'title',
                        'query': q,
                        'fuzzy': {
                            maxEdits: 2,
                            prefixLength: 0,
                            maxExpansions: 10
                        }
                  }
                }
            }, // Added comma here
            {
                $limit: 10
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    score: { $meta : "searchScore" }
                }
            }
        ];

        // Execute the aggregation pipeline using Mongoose's aggregate function
        const results = await movies.aggregate(pipeline).exec();

        // Send the search results as a JSON response
        res.status(200).json({ message: 'Search results', results });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Export the router
module.exports = router;
