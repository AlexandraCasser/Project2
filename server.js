var express        = require('express'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    port           = 3000 || process.env.PORT,
    app            = express(),
    session        = require('express-session'),
    passport       = require('passport');

mongoose.connect('mongodb://localhost/project2');

//Express
app.use(express.static('public'));
// require('./config/passport')(passport);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(bodyParser.json());

//Passport Reqs
app.use(session({ secret: 'secret-session' }));
app.use(passport.initialize());
app.use(passport.session());

//Routes
var usersController = require("./controllers/usersController");
require("./config/passport.js")(passport);

app.use("/users", usersController);

app.get("/", function(req, res){
  res.redirect("/users");
});

app.listen(port, function() {
    console.log('Running on port ' + port);
});