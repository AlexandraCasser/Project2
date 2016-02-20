module.exports = function(app,passport) {

  var quotesController = require('./controllers/quotesController'),
      usersController  = require('./controllers/usersController');

  app.use('/quotes', quotesController);
  app.use('/users', usersController);

  app.get('/', function(req, res) {
   res.redirect('/users');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs');
  });

  app.get('/signup', function(req, res) {
    res.render('signup.ejs');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/users', // redirect to the secure profile section
    failureRedirect : '/users', // redirect back to the users page if there is an error
    failureMessage: "Invalid Signup Info"
  }));

  app.post('/login', passport.authenticate('local-login', {failureRedirect: '/users', failureMessage: "Invalid username or password"}), function(req, res) {
    if(req.user.id) {
      req.session.messages = [];
      res.redirect('/users/'+req.user.id)
    };
  });

}