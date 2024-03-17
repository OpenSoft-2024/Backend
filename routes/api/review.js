// Schema ==> {UserID, Ratings, CommentID, MovieID}
// API list ==> CRUD
// Create
// Read - [GetByMovieID, GetByUserID]
// Update - [Ratings, Comments]
// Delete - [DeleteByCommentID (Admin + User)]
const Review = require("../../models/Review");

const router=require("express").Router();

//route to create a new Review
router.post('/create',async (req,res)=>{
    const newReview = new Review({
        userId: req.body.userId,
        ratings: req.body.ratings,
        comment: req.body.comment?req.body.comment:'',
        movieId: req.body.movieId,
    });
    try{
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    }catch(err){
        res.status(500).json(err);
    }
})

//search by movieId
router.get('/search/movie/:id',async (req,res)=>{
    const movieId=req.params.id;
    try{
        const reviews = await Review.find({movieId: movieId});
        res.status(200).json(reviews);
    }catch(err){
        res.status(500).json(err);
    }

})

//search by userId
router.get('/search/user/:id',async (req,res)=>{
    const userId = req.params.id;
    try{
        const reviews = await Review.find({userId: userId});
        res.status(200).json(reviews);
    }catch(err){
        res.status(500).json(err);
    }
})

//update review
router.put('/:id',async(req,res)=>{
    const reviewId=req.body.id;
    try{
        const updatedReview = await Review.findByIdAndUpdate(reviewId,
            {
                $set: {
                    userId: req.body.userId,
                    ratings: req.body.ratings,
                    commentId: req.body.commentId,
                    movieId: req.body.movieId,
                }
            },{new: true});
            res.status(200).json(updatedReview);
    }catch(err){
        res.status(500).json(err);
    }
})

//delete review
router.delete(":/id",async(req,res)=>{
    const reviewId=req.body.id;
    try{
        await Review.findByIdAndDelete(reviewId)
        res.status(200).json("Review has been deleted!");
    }catch(err){
        res.status(500).json(err);
    }
})