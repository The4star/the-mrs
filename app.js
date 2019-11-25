const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

// config 

require('dotenv').config()
require('./config/passport')(passport);
require('./config/passport-google')(passport);
require('./config/passport-facebook')(passport);

// app requirements
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())
app.use(session({
    secret: process.env.SEEK,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

// routes
const authRoute = require('./routes/authRoute');

app.use('/', authRoute);

module.exports = app;