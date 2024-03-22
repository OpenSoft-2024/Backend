const express = require('express');
const router = express.Router();
const passport = require('passport');
const Movie=require('../../models/Movie');
const auth=require('../../middleware/auth')


// POST endpoint to create a new movie
router.post('/',auth, async (req, res) => {
    try {
        const {
            title,
            year,
            runtime,
            released,
            poster,
            plot,
            fullplot,
            lastupdated,
            type,
            directors,
            imdb,
            cast,
            countries,
            genres,
            tomatoes,
            num_mflix_comments,
            plot_embedding
        } = req.body;

        const newMovie = new Movie({
            title,
            year,
            runtime,
            released,
            poster,
            plot,
            fullplot,
            lastupdated,
            type,
            directors,
            imdb,
            cast,
            countries,
            genres,
            tomatoes,
            num_mflix_comments,
            plot_embedding
        });

        const savedMovie = await newMovie.save();

        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(500).json({ message: 'Error creating movie', error: error.message });
    }
});



// Search for movies,
router.get('/search',auth, async (req, res) => {
    // Mock logic: return all movies for demonstration
    try{
       const movie= await Movie.find({"title":req.body.title})
       if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json(movie);

    }
    catch(err)
    {
       res.status(500).json({ message: 'Error fetching movies',error:err })
    }
});

// Get a movie by its ID
router.get('/id/:id',auth, async (req, res) => {
    // console.log(req.query.id)
    try{
        const movie= await Movie.findById(req.params.id)
        if (!movie) {
         return res.status(404).json({ error: 'Movie not found' });
     }
     res.status(200).json(movie);
 
     }
     catch(err)
     {
        res.status(500).json({ message: 'Error fetching movies',error:err })
     }
});

router.get('/language',auth,async (req, res) => {
    const language=req.query.language
    // console.log(language)
    // to do => create language model and store movie id list in it
    try{
        const movies = await Movie.find({ languages: { $in: [language] } });
        if (!movies) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(200).json(movies);
    }
    catch(err){
        res.status(500).json({ error: 'Error fetching movie' })
    }
})

router.get('/genres',auth,async(req,res)=>{
    const genre=req.query.genre
    try{
        const movies = await Movie.find({ genres: { $in: [genre] } });
        if (!movies) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movies);
    }
    catch(err){
        res.status(500).json({ error: 'Error fetching movie' })
    }


})

router.get('/gethits',auth,async(req,res)=>{
    try{

        const movies=await Movie.find().sort({ "tomatoes.viewer.rating": -1 }).limit(10)
        if (!movies) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(200).json(movies);
    }
    catch(err){
        res.status(500).json({ error: 'Error fetching movies' })
    }
})

router.get('/latest',auth,async(req,res)=>{
    try{
        const movies=await Movie.find().sort({ released: -1 }).limit(10)
        if (!movies) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(200).json(movies);
    }
    catch(err){
        res.status(500).json({ error: 'Error fetching movies' })
    }
})




// Update a movie by its ID
router.put('/:id',auth,async (req, res) => {
    try{
        const movie= await  Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!movie) {
         return res.status(404).json({ error: 'Movie not found' });
     }
     res.status(200).json(movie);
 
     }
     catch(err)
     {
        res.status(500).json({ message: 'Error updating movies',error:err })
     }
});

// Delete a movie by its ID
router.delete('/:id',auth, async (req, res) => {
    try{
        if(!req.isAdmin)
        {
            res.status(403).json({"error":"Not Allowed"})
        }
        const movie= await Movie.findByIdAndDelete(req.params.id)
        if (!movie) {
         return res.status(404).json({ error: 'Movie not found' });
     }
     res.status(200).json(movie);
 
     }
     catch(err)
     {
        res.status(500).json({ message: 'Error deleting movies',error:err })
     }
});



module.exports = router;
