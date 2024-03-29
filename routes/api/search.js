const router=require("express").Router();
const Movie = require("../../models/Movie");

//title search
// autocomplete 
// fuzzy search
// score 
// semantic by langchain 
// partial match 


//plot search
// autocomplete
// fuzzy search
// score
// semantic by langchain

const searchResultsByTitle = async (query) => {

    const results = await Movie.find({title:{$regex:query,$options:'i'}})
    return results
}

router.get('/',async (req,res)=>{
    
    const {query} = req.query
    
})

module.exports = router;