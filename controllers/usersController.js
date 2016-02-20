var express  = require('express');
    router   = express.Router();
    User     = require('../models/users.js'),
    passport = require('passport');    


// Note: locals is express functionality that allows us to retrieve later in ejs to tailor the content

// INDEX
router.get('/', function(req, res) {  // <----------- TEST HERE IF REQ.USER PERSISTED, IF EXISTS THEN RUN THE PAGE
    res.locals.login = req.isAuthenticated(); // <----- will equal true or false depending on logged in
    // need to get all users from the database
    User.find({}, function(err, data) {
        res.render('users/index.ejs', {
            users: data
        });
    });
});


// SIGNUP / create new user
router.post('/', passport.authenticate('local-signup', {
    failureRedirect : '/users' // redirect back to the signup page if there is an error
}), function(req, res) {
        res.redirect('/users/' + req.user.id);  // <--------- comes from passport.js
});


// JSON
router.get('/json', function(req, res) {
    User.find({}, function(err, data) {
        res.send(data, {
            users: data
        });
    });
});    


// SINGLE JSON FOR USER
// make route here -  want json for one particular user
router.get('/:id/json', function(req, res) {
    User.findById(req.params.id, function(err, data) {
        res.send(data.locations);
    });
});


// LOGIN  //<------------------- COME BACK TO THIS -- BROKEN SHOULD BE EMAIL / PASSWORD?
// process the login form
router.post('/login', passport.authenticate('local-login', {
    failureRedirect : '/users'
}), function(req, res) {
        res.redirect('/users/' + req.user.id);  // <--------- comes from passport.js
});



// LOGOUT
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/users');
});


// Show page for after login
router.get('/:id', isLoggedIn, function(req, res) {  //checks if user is logged in
    res.locals.usertrue = (req.user.id == req.params.id); // lists users
    User.findById(req.params.id, function(err, data) { //finds single user
        // res.send(req.params.id);
        res.render('users/show.ejs', {
            users: data
        });
    });
});


// NEW LOCATION ROUTE
router.post('/:id/addLocation', function(req, res) {
    // find user by id
    User.findById(req.params.id, function(err, userVar) {
        // create new location for this user
        var addLocation = new Location(req.body);
        // save new location
        addLocation.save(function(err, loc) {
            // push username into assUser array in locations data
            loc.assUsers.push(userVar.username);
            // push new location into location array
            userVar.locations.push(loc);
            // save user with new location in array
            userVar.save(function(err, newData) {
                // redirect
                loc.save(function(err, newLocData) {
                    res.redirect('/users/' + req.params.id);
                });
            });
        });    
    });
});


// DESTROY
router.delete('/:id', function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, data) {
        res.redirect('/users');
    });
});

// alternative from dan's notes
// router.delete("/:id", function(req, res) {
//     var deleteUser = req.params.id;
//     User.findById(deleteUser, function(err, data) {
//         for (var i = 0; i <users.length i++) {
//             User.findByIdAndRemove(deleteUser, function(err, users) {
//                 res.redirect("/users");
//             });
//         };
//     });
// });



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    //if user exists, do this
    if (req.isAuthenticated())
        return next();
    // if not
    res.redirect('/');
};

module.exports = router;
