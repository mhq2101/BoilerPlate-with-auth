const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const volleyball = require('volleyball');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const User = require('../db/models/users.js')

if (process.env.NODE_ENV === 'development') {
  require('../localSecrets'); // this will mutate the process.env object with your secrets.
}
//body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//logging middleware
app.use(volleyball);
//session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
  resave: false,
  saveUninitialized: false
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());




//static routing
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', require('./api')); // matches all requests to /api

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// const port = process.env.PORT || 3000; // this can be very useful if you deploy to Heroku!
// app.listen(port, function () {
//   console.log('listening on port', port)
// });

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

module.exports = app;