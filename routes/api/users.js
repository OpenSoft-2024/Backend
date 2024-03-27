const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const authMiddleWare = require("../../middleware/auth");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const alphabetImages = {
    'a': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAb1BMVEUNfoD///8Ae30Adnj7/f0AcHLt9PSiw8P2+vpTnZ7y+Pjl8PCBsrMAdHdMl5kxioy+29upzc7U5OS91tdaoqN3qKmIr7CJubqSvb6x0dIxhIZEjI48h4hhoKGaxMXO5OR6tbZvrrA9k5Uah4nK2tuXb2ZTAAAD90lEQVR4nO3bYXeqIBwGcAVyJqaJOTGHpvb9P+PVWlsmnVZ4cTvn+b2698X47xkIKug4AAAAAAAAAAAAAAAAAAAAAAAAALMiJwuVduYs3Te1L6Oo3DvW8/QFP8r1jKVJrKraZ8ytKxVbjUOcOEu4y1hQS9XNUZmqred+YmlmMQ1xDttLZZcnETVvMePuFR46ttKQuPKuS4udaZpNOGrQdb3cUt+QfeWPS/O1WRqiuHuDZ5bChP5taVGalCZdetug625jK2kiMS2dmIwK2kw6pp8FQith5LSyy00mAVpoWnQTG3PAvtZUZm+blxsk8VbTosuNhu4PS3/oKrvp639HOr38T9YWwuy0lUX7epgs0Da5sxDmoA8TIczgFw6z18OQWDeluIGNCaDUhtka3G4SzZrZt7i3MTVrB0Vhss7c3pmd2Fk0K01lrgzCaMeZwbh9pnSk6ZrUqEnaTLrGt9MxuvnM9LZ5k9/Mzqyy9giQsHHpQL1+M3NukuSjvvEqO/fMQ+m4GD0EeKFhlr7JzU58dQ4TIbX52CzFV+d42/VqhjZpm6fCY77PU9nafaFBoreU+z7zRBrG5q8ATm1SJ8re399VZ7FbLqU71VfOIme+0oTQwRJvAZerDAAAAAAAAAAAAPAyQpc6WDk7Qh2VZdEyceat2reWFdzzRD7L4cYni9Ouo/NsQQz6XknPO5yBnK3RHxdvi1qkajNLnP5aUenX7p3RfvMraHPaamNFa77XRVZOU1/vBkrb4+yyd+fldGN08fRRwpsd9MpumFVyVTuPXp0L+ol4r6aH96qZf9sH6OhwpZeo54+LD0fm96oSbJLFz+xeM/TmpCirpSqf2JPsr3inVPl2cnh2aCuxtnN/Nhpmn3PQUWYtofRRD532TjsVJrX+bFhgO4tDWs3flHl1kqto79xLNORwulKFw2a5NonrFZn9NZNK3VmofrxzkVZStR1drVb0YkOH/5IuyvIqFVx/9nD46bTpNkvczSjtqduhg3yfcyGORXU4NOvBrjmEb4kQgnuBP73gvweYiq19hTBCSHzQnBcfhQqCwDvp/8HuhzjjibL/7c51HO25u5fwsF2mU77jbEhzb7A9I0h3q0UulUmcXRHcmZl+hAVCtjPefZuhq07W92baB3xey/g3dMq34VhSdXw6TyCOcoFDVA+R4YFEFj/uoGE1SsL28e3CQvrFvWszmaTi7pL4iR8LmamY/NYkZ6c3K3GUhbLY8v5p/mptYaxfcXgfowqzqOxm/cT0/yHDiHPijzJSTZiHb2cyzA9KReXH/g++Tbp8Wfz1W5PPL37/VgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9/gH7gDBYPxaZ2QAAAABJRU5ErkJggg==',
    // 'b': 'https://i.pinimg.com/236x/46/07/ca/4607ca05e14470e9dcc967c21bc68775.jpg',
    // 'c': 'https://i.pinimg.com/236x/3e/8b/ac/3e8bac5dc61463ff889e709c6d5c8ddf.jpg',
    // 'd':'https://i.pinimg.com/236x/a0/79/10/a07910a53c808ada2e1fd21d4e60916a.jpg',
    // 'e':'https://i.pinimg.com/236x/e2/87/5b/e2875b829a2ce9d47767c2d2669e6d29.jpg',
    // 'f':'https://i.pinimg.com/236x/f6/f5/7e/f6f57ebc26a8a28a367279753d77041b.jpg',
    // 'g':'https://i.pinimg.com/236x/60/17/27/6017276a01fe832935d86cec09c5b316.jpg',
    // 'h':'https://i.pinimg.com/236x/e4/6d/52/e46d52878e66a17ae6d3dfa9853f8f03.jpg',
    // 'i':'https://i.pinimg.com/236x/0e/5b/6a/0e5b6a44b5ff16e80d7efac27babdf10.jpg',
    // 'j':'https://i.pinimg.com/236x/ad/35/e7/ad35e7954a00754a3a2134823ca16421.jpg',
    // 'k':'https://i.pinimg.com/236x/38/95/e7/3895e789e870aa246329e0724e2479f3.jpg',
    // 'l':'https://i.pinimg.com/236x/92/21/fe/9221fe3ff618fa6e52e1bcfa4f3b33a2.jpg',
    // 'm':'https://i.pinimg.com/564x/65/34/74/65347478b84f38500c5c4bfc53363f59.jpg',
    // 'n':'https://i.pinimg.com/236x/4b/40/06/4b40068ee917e17c07f99b9eef784e34.jpg',
    // 'o':'https://i.pinimg.com/236x/dc/24/31/dc24316c81f37bec7d4d4596e9549982.jpg',
    // 'p':'https://i.pinimg.com/236x/75/60/cf/7560cf4322822f1dd3014c102fa51be3.jpg',
    // 'q':'https://i.pinimg.com/236x/fa/06/03/fa060367405c107d0a2dbeba95002366.jpg',
    // 'r':'https://i.pinimg.com/236x/e3/5c/5b/e35c5bf045fbcccf4a2f4c226374d7e4.jpg',
    // 's':'https://i.pinimg.com/236x/0c/36/93/0c36930e1c80d3f6740d43175de0df88.jpg',
    // 't':'https://i.pinimg.com/236x/dc/8a/fa/dc8afab09b0cdeb79aab14df4fe5a61e.jpg',
    // 'u':'https://i.pinimg.com/564x/d5/1b/b9/d51bb95841076ee20f1813a193bf179f.jpg',
    // 'v':'https://i.pinimg.com/474x/f0/40/8f/f0408f4256b23ffa2e424bcfc49fb085.jpg',
    // 'w':'https://i.pinimg.com/236x/d3/a0/62/d3a062bda19ca72791dc911d1764fd15.jpg',
    // 'x':'https://i.pinimg.com/236x/7f/91/61/7f9161506ecd5986572524c812b69423.jpg',
    // 'y':'https://i.pinimg.com/236x/f7/b5/fd/f7b5fde53db4f56e6e70275612e52b5e.jpg',
    // 'z':'https://i.pinimg.com/236x/ee/58/be/ee58beaca77439b2a58c36460a3c152a.jpg',
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
            //const firstLetter = req.body.name.toLowerCase()[0];
            const imageURL = alphabetImages['a'] || 'default_url.jpg'; 
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

router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.password = "Password Incorrect";
      return res.status(400).json(errors);
    }
    const payload = { userId: user._id, isAdmin: user.isAdmin };
    const token = await jwt.sign(payload, keys.secretOrKey, {
      expiresIn: "2d",
    });
    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/delete", authMiddleWare, async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    if (user._id != req.userId) {
      if (!req.isAdmin) 
      {res.status(402).json("Not Allowed");}
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.password = "Password Incorrect";
      return res.status(400).json(errors);
    }
    const result = await Movie.deleteOne({ _id: user._id });
    if (result.deletedCount > 0) {
      res.status(200).json("User deleted successfully.");
    } else {
      res.status(404).json("Movie not found or already deleted.");
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/current", authMiddleWare, (req, res) => {
  res.json({
    userId: req.userId,
    isAdmin: req.isAdmin,
  });
});

module.exports = router;
