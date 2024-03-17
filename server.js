const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require("cors");

const users = require('./routes/api/users');
// const profile = require('./routes/api/profile');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users);
// app.use('/api/profile', profile);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));