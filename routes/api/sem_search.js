const express = require('express');
const router = express.Router();
const Movie = require('../../models/Movie');
const axios = require('axios');

const hf_token = "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";
const embedding_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";

// Function to generate embedding
async function generate_embedding(text) {
    try {
        const response = await axios.post(embedding_url, {
            inputs: text
        }, {
            headers: {
                Authorization: `Bearer ${hf_token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error(`Request failed with status code ${response.status}: ${response.data}`);
        }

        return response.data;
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}

// Route to handle embedding generation for a single movie
router.get('/generate-embedding', async (req, res) => {
    const queryString = req.query.queryString;
    if (!queryString) {
        return res.status(400).json({ error: "Query string parameter is missing" });
    }

    try {
        const embedding = await generate_embedding(queryString);
        res.json({ embedding });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to update plot embeddings for all movies
router.get('/update-plot-embeddings', async (req, res) => {
    try {
        const movies = await Movie.find();

        for (const movie of movies) {
            if (movie.plot) {
                const embedding = await generate_embedding(movie.plot);
                movie.plot_embedding = embedding;
                await movie.save();
            }
        }
        
        console.log("Plot embeddings updated for all movies");
        res.status(200).json({ message: "Plot embeddings updated for all movies" });
    } catch (error) {
        console.error("Error updating plot embeddings:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route to search for movies based on embeddings
// Route to search for movies based on embeddings
router.get('/plot', async (req, res) => {
    try {
        const query = req.query.q; // Change 'query' to 'q'
        if (!query) {
            return res.status(400).json({ error: "Query parameter is missing" });
        }

        const queryEmbedding = await generate_embedding(query);

        const results = await Movie.aggregate([
            {
                $vectorSearch: {
                    queryVector: queryEmbedding,
                    path: "plot_embedding",
                    numCandidates: 100,
                    limit: 4,
                    index: "plot_embedding",
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    //plot: 1
                }
            }
        ]);

        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/title', async (req, res) => {
    try {
        const query = req.query.q; // Change 'query' to 'q'
        if (!query) {
            return res.status(400).json({ error: "Query parameter is missing" });
        }

        const queryEmbedding = await generate_embedding(query);

        const results = await Movie.aggregate([
            {
                $vectorSearch: {
                    queryVector: queryEmbedding,
                    path: "title_embedding", // Change path to title_embedding
                    numCandidates: 100,
                    limit: 4,
                    index: "vector_index", // Change index name to vector_index
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    // plot: 1
                }
            }
        ]);

        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;