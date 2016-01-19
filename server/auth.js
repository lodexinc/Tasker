function setupAuth(User, Category, app) {

  // passport configuration
  var passport = require('passport');

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function(error, user) {
      done(error, user)
    });
  });

  var facebookStrategy = require('passport-facebook').Strategy;

  passport.use(new facebookStrategy({
      clientID: "558471754311789",
      clientSecret: "4d1bd50a4f28b4733aca292642ca3259",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      enableProof: false,
      profileFields: ['id', 'displayName', 'email']
    },
    function(accessToken, refreshToken, profile, done) {


      User.findOneAndUpdate(
        {
          'data.oauth.id': profile._json.id
        },
        {
          $set: {
            name: profile._json.name,
            email: profile._json.email,
            picture: 'http://graph.facebook.com/' + profile._json.id + '/picture?type=large',
            'data.oauth.provider': 'facebook',
            'data.oauth.id': profile._json.id,
            'data.oauth.token': accessToken
          }
        },
        { new: true, upsert: true },
        function (err, user) {
          // After user is created, check if user owns a "General" category
          if(!err) {
              Category.findOneAndUpdate(
              { createdBy: user._id, name: 'General' }, 
              { $set: { createdBy: user._id, name: 'General' } },
              { new: true, upsert: true }, 
              function(err, category) {
                if(err) { console.log({error: err}) }
              });
          }

          return done(err, user);
        });
    }
  ));

  // Add session middlewares to express app
  var session = require('express-session');

  app.use(session({
    secret: 'session secret',
    saveUninitialized: false,
    resave: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Routes
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });
}

module.exports = setupAuth;
