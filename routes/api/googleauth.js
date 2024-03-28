const express = require('express');
const passport = require('passport');
const router = express.Router();
const keys = require('../../config/keys');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../../models/User");
const profile = require('../../models/profile.js');


function isLoggedIn(req,res,next){
    req.user ? next() : res.sendStatus(401);
}


router.get('/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: 'http://localhost:5173/',
        failureRedirect: '/auth/google/failure'
}));

router.get('/google/failure',(req,res)=>{
    res.send("Something went wrong");
});

// router.get('/protected', isLoggedIn, async (req, res) => {
//     res.send("ok")
// });


module.exports = router;