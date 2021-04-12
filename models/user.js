var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//adauga la UserSchema metode din pachetul passport-local-mongoose
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);