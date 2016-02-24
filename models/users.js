// userSchema biz
var mongoose       = require('mongoose');
	quotesSchema   = require('./quotes').schema;  // <-------- requires only the schema
    bcrypt         = require('bcrypt-nodejs');


var userSchema = mongoose.Schema({
	username:String,
	email:String,
	password:String,
	quotes: [quotesSchema]
});


// GENERATING A HASH USING BCRYPT
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};



// var User = mongoose.model('User', userSchema);
module.exports = mongoose.model("User", userSchema);
