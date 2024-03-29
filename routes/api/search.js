const router=require("express").Router();
const Movie = require("../../models/Movie");

//normal search
// autocomplete            -- DONE
// fuzzy search            -- DONE
// semantic by langchain 
// partial match          
// hybrid search 

// suggestions 
// geospatial
// multilingual


//plot search
// autocomplete
// fuzzy search
// score
// semantic by langchain
// partial match 
// hybrid search 

const searchResultsByTitle = async (query) => {

    const results = await Movie.find({title:{$regex:query,$options:'i'}})
    return results
}

router.get('/',async (req,res)=>{
    
    const {query} = req.query

    if (!q || q.trim().length === 0) {
        return res.status(400).json({ msg: 'Please provide a search query.' });
    }

    
    
})

module.exports = router;