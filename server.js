const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require("cors");

;require('./validation/auth.js')

const users = require('./routes/api/users');
const movies = require('./routes/api/movies.js');
const reviews = require('./routes/api/review');
const subscription=require('./routes/api/subscription.js');
const profile = require('./routes/api/profile');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

function isLoggedIn(req,res,next){
    req.user ? next() : res.sendStatus(401);
}

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false}
  }));

const db = require('./config/keys').mongoURI;


mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);





app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/failure',(req,res)=>{
    res.send("Something went wrong");
});

app.get('/auth/protected',isLoggedIn,(req,res)=>{
    let name = req.user;
    
    res.send(`hello ${name.displayName}`);
});


app.use('/api/users', users);
app.use('/api/reviews',reviews);
app.use('/api/movies', movies);
app.use('/api/subscription',subscription);
app.use('/api/profile', profile);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));