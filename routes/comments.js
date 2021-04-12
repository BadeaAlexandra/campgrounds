var express     = require("express");
var router      = express.Router({mergeParams: true}); //pentru a retine :id din ruta si a-l transmite intre pagini 

var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

var middleware  = require("../middleware");  //nu am scris "../middleware/index.js" pentru ca index.js este un nume special

//========================
// COMMENTS ROUTES
//========================

//NEW  (poate fi accesata doar daca utilizatorul este autentificat)
router.get("/new", middleware.isLoggedIn, function(req,res){
    //res.send("This will be the comment form");
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            //console.log(req.body.comment);
            var newComment = req.body.comment;
            Comment.create(newComment, function(err, newlyCreatedComment) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }
                else {
                    //add username and id to comment
                    newlyCreatedComment.author.id = req.user._id;
                    newlyCreatedComment.author.username = req.user.username;
                    //save comment
                    newlyCreatedComment.save();
                    foundCampground.comments.push(newlyCreatedComment);
                    foundCampground.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit", {campgroundID: req.params.id, comment: foundComment});
        }
    })
});


// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    //destroy campgrounds
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;