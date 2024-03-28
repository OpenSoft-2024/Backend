const passport = require('passport');
const keys = require('../config/keys');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/profile');
require('dotenv').config()

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
  clientID:    process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/google/callback",
  passReqToCallback : true
},
async function(req, accessToken, refreshToken, profile, done) { // Added 'req' as an argument
  try {
    console.log(profile)
    let user = await User.findOne({ email: profile.email });
    
    if (user) {
        const payload = { userId: user._id, isAdmin: user.isAdmin };
        jwt.sign(payload, keys.secretOrKey, { expiresIn: "2d" }, (err, token) => {
            if (err) throw err;
            localStorage.setItem('token',token);
            // req.res.json({  // Changed 'res' to 'req.res'
            //     success: true,
            //     token,
            // });
        });
        return done(null,user);
    } else {
        const newUser = new User({
            name: profile.displayName,
            email: profile.email,
            password: profile.id,
        });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        const savedUser = await newUser.save();

        const newProfile = new Profile({
            userId:savedUser._id,
            imageUrl: profile.photos[0].value,
            history:[],
            suggestions:[],
            watchlist:[],
            favorites:[],
            subscription:" ",
            rentals:" ",
        })

        await newProfile.save();

        const payload = { userId: savedUser._id, isAdmin: savedUser.isAdmin };
        jwt.sign(payload, keys.secretOrKey, { expiresIn: "2d" }, (err, token) => {
            if (err) throw err;
            localStorage.setItem('token',token);
            // req.res.json({  // Changed 'res' to 'req.res'
            //     success: true,
            //     token,
            // });
        });

        console.log("updated");
        return done(null,savedUser);
    }
} catch (err) {
    console.log(err);
    req.res.status(500).send("Internal Server Error"); // Changed 'res' to 'req.res'
}
}
));

passport.serializeUser((user,done)=>{
  done(null,user)
});

passport.deserializeUser((user,done)=>{
  done(null,user)
});
