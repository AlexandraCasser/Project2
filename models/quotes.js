var mongoose = require('mongoose');
	userSchema     = require('./users').schema;  // <-------- requires only the schema
    bcrypt         = require('bcrypt-nodejs');
var User 		   = require("./users").schema;
var Quotes 		   = require("./quotes").schema;


var quotesSchema = mongoose.Schema({
	name: String,
	quote: String
});


// var Quotes = mongoose.model('Quotes', quotesSchema);
// module.exports = Quotes;

module.exports = mongoose.model("Quotes", quotesSchema);