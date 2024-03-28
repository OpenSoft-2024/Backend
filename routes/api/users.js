const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const authMiddleWare = require("../../middleware/auth");
const Profile=require('../../models/Profile')
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    await newUser.save();
    
    const payload = { userId: newUser._id, isAdmin: newUser.isAdmin };
    const token = await jwt.sign(payload, keys.secretOrKey, {
      expiresIn: "2d",
    });
    res.json({
      success: true,
      token,
    });
    // res.json(newuser);
  } catch (err) {
    res.status(500).json({ error: err });
  }
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
    // const profile=new Profile({
    //   userId:user._id,
    //   imageUrl:" ",
    //   history:[],
    //   suggestions:[],
    //   watchlist:[],
    //   favorites:[],
    //   rentals:[]

    // })
    // await profile.save()
    // console.log(profile);
    // console.log("profile created");
    const payload = { userId: user._id, isAdmin: user.isAdmin };
    const token = await jwt.sign(payload, keys.secretOrKey, {
      expiresIn: "2d",
    });

    res.status(200).json({
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
