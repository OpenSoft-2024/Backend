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
    'a': 'https://i.pinimg.com/564x/c2/c0/42/c2c042033998be85ddcf617e4e220161.jpg',
    'b': 'https://i.pinimg.com/236x/46/07/ca/4607ca05e14470e9dcc967c21bc68775.jpg',
    'c': 'https://i.pinimg.com/236x/3e/8b/ac/3e8bac5dc61463ff889e709c6d5c8ddf.jpg',
    'd':'https://i.pinimg.com/236x/a0/79/10/a07910a53c808ada2e1fd21d4e60916a.jpg',
    'e':'https://i.pinimg.com/236x/e2/87/5b/e2875b829a2ce9d47767c2d2669e6d29.jpg',
    'f':'https://i.pinimg.com/236x/f6/f5/7e/f6f57ebc26a8a28a367279753d77041b.jpg',
    'g':'https://i.pinimg.com/236x/60/17/27/6017276a01fe832935d86cec09c5b316.jpg',
    'h':'https://i.pinimg.com/236x/e4/6d/52/e46d52878e66a17ae6d3dfa9853f8f03.jpg',
    'i':'https://i.pinimg.com/236x/0e/5b/6a/0e5b6a44b5ff16e80d7efac27babdf10.jpg',
    'j':'https://i.pinimg.com/236x/ad/35/e7/ad35e7954a00754a3a2134823ca16421.jpg',
    'k':'https://i.pinimg.com/236x/38/95/e7/3895e789e870aa246329e0724e2479f3.jpg',
    'l':'https://i.pinimg.com/236x/92/21/fe/9221fe3ff618fa6e52e1bcfa4f3b33a2.jpg',
    'm':'https://i.pinimg.com/564x/65/34/74/65347478b84f38500c5c4bfc53363f59.jpg',
    'n':'https://i.pinimg.com/236x/4b/40/06/4b40068ee917e17c07f99b9eef784e34.jpg',
    'o':'https://i.pinimg.com/236x/dc/24/31/dc24316c81f37bec7d4d4596e9549982.jpg',
    'p':'https://i.pinimg.com/236x/75/60/cf/7560cf4322822f1dd3014c102fa51be3.jpg',
    'q':'https://i.pinimg.com/236x/fa/06/03/fa060367405c107d0a2dbeba95002366.jpg',
    'r':'https://i.pinimg.com/236x/e3/5c/5b/e35c5bf045fbcccf4a2f4c226374d7e4.jpg',
    's':'https://i.pinimg.com/236x/0c/36/93/0c36930e1c80d3f6740d43175de0df88.jpg',
    't':'https://i.pinimg.com/236x/dc/8a/fa/dc8afab09b0cdeb79aab14df4fe5a61e.jpg',
    'u':'https://i.pinimg.com/564x/d5/1b/b9/d51bb95841076ee20f1813a193bf179f.jpg',
    'v':'https://i.pinimg.com/474x/f0/40/8f/f0408f4256b23ffa2e424bcfc49fb085.jpg',
    'w':'https://i.pinimg.com/236x/d3/a0/62/d3a062bda19ca72791dc911d1764fd15.jpg',
    'x':'https://i.pinimg.com/236x/7f/91/61/7f9161506ecd5986572524c812b69423.jpg',
    'y':'https://i.pinimg.com/236x/f7/b5/fd/f7b5fde53db4f56e6e70275612e52b5e.jpg',
    'z':'https://i.pinimg.com/236x/ee/58/be/ee58beaca77439b2a58c36460a3c152a.jpg',
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