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
const multer = require('multer');

// Hugging Face API
const hf_token = process.env.HF_TOKEN;
const embedding_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";


// Image search
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



function encodeImage(imageBuffer) {
    return Buffer.from(imageBuffer).toString('base64');
}

async function getCaption(base64Image, apiKey, tok, prefix) {
    const customPrompt = "Directly describe with brevity and as brief as possible the scene or characters without any introductory phrase like 'This image shows', 'In the scene', 'This image depicts' or similar phrases. Just start describing the scene please. Do not end the caption with a '.'. Some characters may be animated, refer to them as regular humans and not animated humans. Please make no reference to any particular style or characters from any TV show or Movie. Good examples: a cat on a windowsill, a photo of smiling cactus in an office, a man and baby sitting by a window, a photo of wheel on a car,";
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
    };
    
    const payload = {
        model: 'gpt-4-vision-preview',
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: customPrompt },
                    { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                
                ]
            }
        ],
        max_tokens: 300
    };
    
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
        const { choices } = response.data;
        
        if (choices && choices.length > 0 && choices[0].message) {
            let caption = choices[0].message.content || 'Caption not found';
            caption = caption.trim().replace(/[,"]/g, '');
            const styleOrActionPhrase = prefix ? `in the style of ${tok}` : tok;
            return `${caption} ${styleOrActionPhrase}`;
        }
    } catch (error) {
        console.error(`API request failed: ${error.message}`);
    }
}

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

/// Normal title search
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

// Normal plot search
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



// Image search -- TO BE TESTED
router.post('/image-search', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const base64Image = encodeImage(req.file.buffer);
        const apiKey = process.env.OPENAI_API_KEY; 
        const tok = req.body.tok; 
        const prefix = req.body.prefix === 'y' ? 'in the style of' : req.body.prefix; 
    

        const caption = await getCaption(base64Image, apiKey, tok, prefix);
        const caption_embeddings = await generate_embedding(caption);

        const results = await Movie.aggregate([
            {
                $vectorSearch: {
                    queryVector: caption_embeddings,
                    path: "poster_details_embedding", 
                    numCandidates: 100,
                    limit: 4,
                    index: "poster_details_embedding", 
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    released: 1,
                    poster: 1
                }
            }
        ]);

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing image search request' });
    }
});



module.exports = router;




