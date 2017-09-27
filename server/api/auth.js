const passport = require('passport');
const auth = require('express').Router()
const User = require('../../db/models/users.js')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//serialize/ deserialize
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done);
});

auth.post('/login', (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) res.status(401).send('User not found');
      else if (!user.correctPassword(req.body.password)) res.status(401).send('Incorrect password');
      else {
        req.login(user, err => {
          if (err) next(err);
          else res.json(user);
        });
      }
    })
    .catch(next);
});

auth.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      req.login(user, err => {
        if (err) next(err);
        else res.json(user);
      });
    })
    .catch(next);
});

auth.post('/logout', (req, res, next) => {
  req.logout();
  res.sendStatus(200);
});

auth.get('/me', (req, res, next) => {
  res.json(req.user);
});

// auth.get('/google', passport.authenticate('google', { scope: 'email' }));

// // handle the callback after Google has authenticated the user
// auth.get('/google/callback',
//   passport.authenticate('google', {
//     successRedirect: '/', // or wherever
//     failureRedirect: '/' // or wherever
//   })
// );



// const strategy = new GoogleStrategy(googleConfig, function (token, refreshToken, profile, done) {
//   const googleId = profile.id;
//   const name = profile.displayName;
//   const email = profile.emails[0].value;

//   User.findOne({where: { googleId: googleId  }})
//     .then(function (user) {
//       if (!user) {
//         return User.create({ name, email, googleId })
//           .then(function (user) {
//             done(null, user);
//           });
//       } else {
//         done(null, user);
//       }
//     })
//     .catch(done);
// });

// register our strategy with passport
// passport.use(strategy);

module.exports = auth;