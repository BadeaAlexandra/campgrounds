//YelpCamp v7

var express                 = require("express");
var bodyParser              = require("body-parser");
var mongoose                = require('mongoose');

var passport                = require("passport");
var LocalStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");

var Campground              = require("./models/campground");
var Comment                 = require("./models/comment");
var User                    = require("./models/user"); 
var seedDB                  = require("./seeds");

var commentRoutes           = require("./routes/comments");
var campgroundRoutes        = require("./routes/campgrounds");
var indexRoutes             = require("./routes/index");
var reviewRoutes            = require("./routes/reviews");

var methodOverride          = require("method-override");

var flash                   = require("connect-flash");

var app = express();
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //pe main.css

app.use(flash()); //pentru mesaje

app.locals.moment = require('moment'); //pentru momentul postarii unui comentariu

//PASSWORD CONFIGURATION
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world", //pentru codificarea sesiunilor
    resave: false,                                          
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware prin care este transmis user-ul curent pe toate rutele in toate template-urile (l-a folosit si in show.ejs)
app.use(function(req, res, next) {
    res.locals.currentUser  = req.user;
    res.locals.error      = req.flash("error");
    res.locals.success    = req.flash("success");
    next();      //pentru a trece la pasul urmator
}); 

app.use(methodOverride("_method"));

//seedDB(); //se executa de fiecare cand este repornit server-ul

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected to DB!'))
        .catch(error => console.log(error.message));

//fisierele cu rute
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes); //inseamna ca in fata tuturor rutelor se afla /campgrounds
app.use("/", indexRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Server Has Started!");
});