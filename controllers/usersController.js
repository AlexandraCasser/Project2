var express  = require('express');
    router   = express.Router();
    User     = require('../models/users.js'),
    logger   = require("morgan"),
    Quotes   = require('../models/quotes.js'),
    passport = require('passport');   


// locals is express functionality that allows us to retrieve later in ejs to tailor the content

// INDEX
router.get('/', function(req, res) {  
    res.locals.login = req.isAuthenticated(); // <----- will equal true or false depending on logged in
    // need to get all users from the database
    User.find({}, function(err, data) {
        res.render('users/index.ejs', {
            users: data
        });
    });
});

router.get('/validate', function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/users/' + req.user.id);
    } else {
        res.redirect('/users');
    }
});


// SIGNUP / create new user
router.post('/', passport.authenticate('local-signup', {
    failureRedirect : '/users' // redirect back to the signup page if there is an error
}), function(req, res) {
    res.redirect('/users/' + req.user.id);  //comes from passport.js
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


// LOGIN  //<----- COME BACK TO THIS -- BROKEN SHOULD BE EMAIL / PASSWORD?
// process the login form
router.post('/login', passport.authenticate('local-login', {
    failureRedirect : '/users'
}), function(req, res) {
        res.redirect('/users/' + req.user.id);  //omes from passport.js
});



// LOGOUT
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/users');
});


// Show page for after login
router.get('/:id', function(req, res) {
    
    if (req.user) { 
        res.locals.usertrue = (req.user.id == req.params.id);
    } else {
        res.locals.usertrue = false;
    };

    User.findById(req.params.id, function(err, data) { //finds single user
        // res.send(req.params.id);
        console.log('!!!!!!!!');
        console.log(err);
        console.log('!!!!!!!!');
        console.log('DATA: ', data);
        res.render('users/show.ejs', {
            user: data
        });
    });
});


//Add a quote
router.post('/:id/addQuote', function(req, res) {
    console.log('DATA FROM FORM: ', req.body);
    User.findById(req.params.id, function(err, user) {
        var addQuote = new Quotes(req.body);
        addQuote.save(function(err, addQuote) {
            user.quotes.push(addQuote);
            user.save(function(err) {
                res.redirect('/users/' + req.params.id);
            });         
        });
    });
});

// Delete quote
router.delete('/:id/deletequote/:quoteid', function(req, res) {

    console.log('DELETE QUOTE ROUTE for user ' + req.params.id + ' quote: ' + req.params.quoteid);

    User.findById(req.params.id, function(err, user) {
        for (var i = 0; i < user.quotes.length; i++) {
    // Quotes.findOneAndRemove({_id: req.params.quoteid}, function(err) {
            if(user.quotes[i].id === req.params.quoteid) {
                console.log('this is happening');
                user.quotes.splice(user.quotes[i], 1)
                user.save(function() {
                    console.log("saved");
                    res.redirect('/users/' + req.params.id);
                })
            } else {
                console.log("delete quote error")
            }
        
        }
        // res.redirect('/users/' + req.params.id);
        console.log('Quote deleted');
    });
});

//Edit route
router.get('/:id/editUser/', function(req, res) {
    // var id = req.body.id;
    User.findById(req.params.id, function(err, user) {
        console.log(user);
        res.render('users/edit.ejs', {user: user});
    });
});


// Edit username
router.put('/:id', function(req, res) {
    var newUserName = req.body;
        console.log("newUserName", newUserName);
        console.log('req.body.username: ', req.body.username);
            User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    res.redirect('/users/' + req.params.id);
    });
});



// Delete user
router.delete('/:id', function(req, res) {
    console.log('DELETE USER ROUTE ACCESSED');
    User.findByIdAndRemove(req.params.id, function(err, data) {
        res.redirect('/users');
    });
});


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    //if user exists, do this
    if (req.isAuthenticated())
        return next();
    // if not
    res.redirect('/');
};

module.exports = router;





//====================CODE GRAVEYARD====================

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



// router.post('/:id/addQuote', function(req, res){
//      // console.log("This is req.body " + req.body);
//      // console.log("This is req.params.id " + req.params.id)
//     User.findByIdAndUpdate(req.params.id, req.body, function(err, data) {
//         res.redirect('/users/' + req.params.id );
//     });
// });



// router.delete('/:id/deletequote', function(req, res) {
//     console.log('DELETE QUOTE ROUTE ACCESSED');
//     console.log(req.params.id);
//     console.log(typeof req.params.id)
//     User.findById(req.params.id, function(err, data) {
//         console.log(err);
//         console.log(data);
//         // console.log(user);
//         // console.log(user.quotes);
//         //     user.quotes.forEach(function(quotes) {
//         //         Quotes.findOneAndRemove({ _id: quotes.id }, function(err) {
//         //         });
//         //     });
//         //     user.remove(function(err) {
//         //         res.redirect('/users');
//         //     });
//     });
// });

// router.delete('/:id/deleteQuote', function(req, res) {
//     console.log('DATA FROM FORM: ', req.body);
//     User.findById(req.params.id, function(err, user) {
//         var deleteQuote = new Quotes(req.body);
//         addQuote.save(function(err, addQuote) {
//             user.quotes.pop(deleteQuote);
//             user.save(function(err) {
//                 res.redirect('/users/' + req.params.id);
//             });         
//         });
//     });
// });

// New quote route
// router.post('/:id/addQuote', function(req, res) {
//     // find user by id
//     User.findById(req.params.id, function(err, userVar) {
//         // create new location for this user
//         var addQuote = new Quotes(req.body);
//         // save new location
//         addQuote.save(function(err, loc) {
//             // push username into assUser array in locations data
//             loc.assUsers.push(userVar.username);
//             // push new location into location array
//             userVar.quotes.push(loc);
//             // save user with new location in array
//             userVar.save(function(err, newData) {
//                 // redirect
//                 loc.save(function(err, newQuoteData) {
//                     res.redirect('/users/' + req.params.id);
//                 });
//             });
//         });    
//     });
// });
