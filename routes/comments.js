var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware");

// =================
// COMMENT ROUTES
// =================
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});
router.post("/", middlewareObj.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
					//adds username and id to comment
					comment.author.id = req.user._id
					comment.author.username = req.user.username
					//save comment
					comment.save()
					campground.comments.push(comment);
					campground.save();
					// console.log(comment)
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
})
//EDIT ROUTE
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})
});
//UPDATE ROUTE
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});
// DELETE ROUTE
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

module.exports = router