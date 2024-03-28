const express = require('express');
const router = express.Router();
const passport = require('passport');
const Movie=require('../../models/Movie');
const auth=require('../../middleware/auth');
const Language = require('../../models/Language');
const Genre = require('../../models/Genre');


// POST endpoint to create a new movie
router.post('/create',auth, async (req, res) => {
    if(!req.isAdmin)
    {
        res.status(404).json("Not Allowed")
    }
    try {
        const {
            title,                  // 1
            year,                   // 2
            runtime,                // 3
            released,               // 4
            poster,                 // 5
            plot,                   // 6
            fullplot,               // 7
            lastupdated,            // 8
            type,                   // 9
            directors,              // 10
            writers,                // 11
            awards,                 // 12
            imdb,                   // 13
            cast,                   // 14
            countries,              // 15
            languages,              // 16
            genres,                 // 17
            tomatoes,               // 18
            num_mflix_comments,     // 19
            plot_embedding          // 20
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
            writers,
            awards,
            imdb,
            cast,
            countries,
            languages,
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

router.get('/gethits',async(req,res)=>{
    try{
        
    //     const fourtithMovie = await Movie.findOne().sort({ _id: 1 }).skip(40); // Skip 19 documents (0-based index)
    //     const twentiethMovie = await Movie.findOne().sort({ _id: 1 }).skip(20); 
    //     await Movie.updateMany({ _id: { $gt: twentiethMovie._id, $lt:fourtithMovie._id } }, { $set: { type: 'R' } });
        // const movies=await Movie.countDocuments({type:'S'})
        
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
    if(!req.isAdmin)
    {
        res.status(404).json("Not Allowed")
    }
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


//scrtipt to add movie to language
//use once only
router.get('/update-language-and-genre-models', async (req, res) => {
    try {
        const movies = await Movie.find();

        for (const movie of movies) {
            const languages = movie.languages;
            const genres = movie.genres;

            // Update language model
            for (const language of languages) {
                let languageRecord = await Language.findOne({ language });

                if (languageRecord) {
                    languageRecord.movieIds.push(movie._id);
                    await languageRecord.save();
                } else {
                    languageRecord = new Language({
                        language,
                        movieIds: [movie._id]
                    });
                    await languageRecord.save();
                }
            }

            // Update genre model
            for (const genre of genres) {
                let genreRecord = await Genre.findOne({ genre });

                if (genreRecord) {
                    genreRecord.movieIds.push(movie._id);
                    await genreRecord.save();
                } else {
                    genreRecord = new Genre({
                        genre,
                        movieIds: [movie._id]
                    });
                    await genreRecord.save();
                }
            }
        }

        res.status(200).json({ message: 'Language and genre models updated successfully.' });
    } catch (error) {
        console.error('Error updating language and genre models:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
