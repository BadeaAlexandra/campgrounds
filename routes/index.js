var express     = require("express");
var router      = express.Router(); 
var passport    = require("passport");
var User        = require("../models/user"); 

var middleware  = require("../middleware"); 

// ROOT ROUTE
router.get("/", function(req,res){
    res.render("landing");
});

// =================
// AUTH ROUTES
// =================

//show sign up form
router.get("/register", function(req,res){
    res.render("register");
});

//handling user sign up
router.post("/register", function(req,res){
    //res.send("REGISTER POST ROUTE");
    //Parola este separata de obiectul User pentru a fi codificata (hashed)
    User.register(new User({username: req.body.username,}), req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        } 
        //se ocupa de autentificarea utilizatorului si tot ce este nevoie in sesiunea curenta si ruleaza serializedUser()
        passport.authenticate("local")(req, res, function(){  //local se poate schimba cu twitter sau facebook (este nevoie de credentiale)
            req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

// =================
// LOGIN ROUTES
// =================

//show login form
router.get("/login", function(req,res){
    res.render("login");
});

//handling user login   :    app.post (path, middleware, callback)

router.post("/login", passport.authenticate("local", {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
}), function(req,res){
    //res.send("LOGIN POST ROUTE");
});


//LOG OUT
router.get("/logout", function(req,res){
    //res.send("Ok, I will log you out");
    req.logout();
    req.flash("error", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;