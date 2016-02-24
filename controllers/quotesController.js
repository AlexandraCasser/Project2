// requirements
var express    = require('express'),
    router     = express.Router();
    Quotes     = require('../models/quotes.js'),
    logger     = require("morgan"),
    passport   = require('passport'); 



// INDEX
router.get('/', function(req, res) {
	Quotes.find({}, function(err, data) {
		res.render('quotes/index.ejs', {
			quotes: data
		});
	});
});


// JSON ROUTE
router.get('/json', function(req, res) {
	Quotes.find({}, function(err, data) {
		res.send(data);
	});
});


// put in middleware here to restrict access to locations page without being logged in


module.exports = router;