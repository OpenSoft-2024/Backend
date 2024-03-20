const express = require('express');
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const authMiddleWare = require('../../middleware/auth');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const alphabetImages = {
    'a': 'url_for_a.jpg',
    'b': 'url_for_b.jpg',
    // Add more alphabet keys and their corresponding image URLs as needed
};

router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);
    if(!isValid) return res.status(400).json(errors);

    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            errors.email = 'Email already exists';
            return res.status(400).json(errors);
        }
        else {
            const firstLetter = req.body.name.toLowerCase()[0];
            const imageURL = alphabetImages[firstLetter] || 'default_url.jpg'; 
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                imageURL: imageURL

            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    })
});

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid) return res.status(400).json(errors);

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email}).then(user => {
        if (!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        }
        else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch)
                {
                    const payload = {userId : user._id,isAdmin : user.isAdmin};
                    jwt.sign(payload, keys.secretOrKey, {expiresIn : "2d"}, (err, token) => {
                        res.json({
                            success: true,
                            token,

                        })
                    });
                }
                else {
                    errors.password = 'Password Incorrect';
                    return res.status(400).json(errors);
                }
            })
        }
    })
});

router.post('/delete', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid) return res.status(400).json(errors);

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email}).then(user => {
        if (!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        }
        else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch)
                {
                    
                }
                else {
                    errors.password = 'Password Incorrect';
                    return res.status(400).json(errors);
                }
            })
        }
    })
});

router.get('/current',authMiddleWare, (req,res) => {
    res.json({
        userId: req.userId,
        isAdmin: req.isAdmin
    });
});

module.exports = router;