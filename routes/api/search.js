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



// Function to generate embedding      

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
                '_id': 1,
                'title': 1,
                'poster':1,
                'released':1
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
        // let results = new Set();
        let result2 = new Set();
        for(const el in autoAndFuzzySearchResults)
        result2.add(el)

        for(const el in partialMatchResults)
        result2.add(el)

        res.status(200).json(result2);

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

        let result2 = new Set();
        for(const el in autoAndFuzzySearchResults)
        result2.add(el)

        for(const el in partialMatchResults)
        result2.add(el)

        res.status(200).json(result2);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});





module.exports = router;



