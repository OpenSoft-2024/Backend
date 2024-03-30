const router=require("express").Router();
const Movie = require("../../models/Movie");

//normal search
// autocomplete            -- DONE
// fuzzy search            -- DONE
// partial match           -- DONE

// suggestions 
// geospatial
// multilingual

// recommendations 
// based on history 
// based on watchlist
// based on favorites

// plot search   
// autocomplete             --DONE
// fuzzy search             --DONE  
// partial match            --DONE 
// hybrid search OR langchain integration 
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

const autoAndFuzzySearch = async (query,index,field) => {

    let results = [];

    try{

        const pipeline = [
            {
                $search: {
                  "index": index,
                  "autocomplete": {
                    'path': field,
                        'query': query,
                        'fuzzy': {
                            maxEdits: 2,
                            prefixLength: 0,
                            maxExpansions: 10
                        }
                  }
                }
            },
            { $limit: 10 },
            {
                $project: {
                    _id: 1,
                    title: 1
                }
            }
        ];

        results = await Movie.aggregate(pipeline).exec();
        return results;
    }
    catch(err){
        console.log(err);
        return results;
    }
}

const partialMatch = async (query,index,field) => {

    let results = [];

    try{
        const agg = [
            {
                '$search': {
                  'index': index,
                  'phrase': {
                    'path': field,
                    'query': query,
                    'slop': 5
                  }
                }
            },
            {
                '$limit': 5
            }, 
            {
                '$project': {
                '_id': 1,
                'title': 1,
                'poster':1,
                'released':1
                }
            }
        ];

        const results = await Movie.aggregate(agg);
        return results;
    }
    catch(err){
        console.log(err);
        return results;
    }
}


router.get('/',async (req,res)=>{
    
    const {query} = req.query

    if (!query || query.trim().length === 0) {
        return res.status(400).json({ msg: 'Please provide a search query.' });
    }
    
    try{
        const autoAndFuzzySearchResults = await autoAndFuzzySearch(query,"title","title");
        const partialMatchResults = await partialMatch(query,"partialmatch","title");

        const results = [...autoAndFuzzySearchResults, ...partialMatchResults];

        res.status(200).json(results);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

router.get('/plot',async (req,res)=>{

    const {query} = req.query

    if (!query || query.trim().length === 0) {
        return res.status(400).json({ msg: 'Please provide a search query.' });
    }

    try{
        const autoAndFuzzySearchResults = await autoAndFuzzySearch(query,"plot","plot");
        const partialMatchResults = await partialMatch(query,"partialmatch_plot","plot");

        const results = [...autoAndFuzzySearchResults, ...partialMatchResults];

        res.status(200).json(results);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

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


router.get('/poster', async (req, res) => {
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
                    path: "poster_details_embedding", // Change path to poster_details_embedding
                    numCandidates: 100,
                    limit: 4,
                    index: "poster_details_embedding", // Assuming the name of the index is "vector_index"
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
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



module.exports = router;