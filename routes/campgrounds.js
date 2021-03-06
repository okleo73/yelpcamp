//Changed to campgrounds from campground
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");
// NODE GEOCODER
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
//INDEX FROM SLIDES - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});
//INDEX - shows all campgrounds
// router.get("/", function(req, res){
// 	//retrieves all campgrounds from the DB
// 	Campground.find({}, function(err, allCampgrounds){
// 		if(err){
// 			console.log(err);
// 		} else{
// 			res.render("campgrounds/index", {campgrounds: allCampgrounds});
// 		}
// 	})
// });
//CREATE - adds new campgrounds to database
// router.post("/", middlewareObj.isLoggedIn, function(req, res){
// 	var name = req.body.name;
// 	var price = req.body.price;
// 	var image = req.body.image;
// 	var desc = req.body.description;
// 	var author = {
// 		id: req.user._id,
// 		username: req.user.username
// 	}
// 	geocoder.geocode(req.body.location, function (err, data) {
//     if (err || !data.length) {
//       req.flash('error', 'Invalid address');
//       return res.redirect('back');
//     }
//     var lat = data[0].latitude;
//     var lng = data[0].longitude;
//     var location = data[0].formattedAddress;
//     var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
// 	// var newCampground = {name: name, price: price, image: image, description: desc, author:author}
// 	//Creates new campground and saves it to the DB
// 	Campground.create(newCampground, function(err, newlyCreated){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.redirect("/campgrounds");
// 		}
// 	})
// });
//CREATE - add new campground to DB
router.post("/", middlewareObj.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
		console.log(err);
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});
//NEW- displays form to create new campground
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});
//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			// console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
});
//EDIT ROUTE
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	})
});
//UPDATE ROUTE
// router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
// 	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
// 		if(err){
// 			res.redirect("/campgrounds");
// 		} else{
// 			res.redirect("/campgrounds/" + req.params.id);
// 		}
// 	})
// });
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
		console.log(err)
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});
//DELETE ROUTE
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
})


module.exports = router;
