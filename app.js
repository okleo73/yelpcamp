// Variables
var express 	   = require("express"),
    app 		   = express(),
	bodyParser 	   = require("body-parser"),
	mongoose 	   = require("mongoose"),
	passport 	   = require("passport"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	flash 		   = require("connect-flash");
// Schemas and Data
var User 	   = require("./models/user"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	seedDB 	   = require("./seeds");
// ROUTES / requiring routes
var indexRoutes      = require("./routes/index"),
	campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments");

// seedDB(); //seeds the db
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true});
//mongoose lab online database
//mongoose.connect("mongodb://colt:rusty@ds055525.mongolab.com:55525/yelpcamp");
mongoose.connect("mongodb+srv://claysmith:claysmith@cluster0-smgxr.mongodb.net/yelp_camp?retryWrites=true&w=majority");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
// MOMENTJS CONFIGURATION
app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(require("express-session")({ //EXPRESS-SESSION CONFIGURATION
	secret: "Rusty",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//ACCESS TO USERS/ALERT MESSAGES
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
//ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
//SERVER
app.listen(process.env.PORT || 3000, function(){
    console.log("The YelpCamp Server Has Started!");
});

//Old ROUTES
// app.get("/", function(req, res){
//     res.render("landing");
// });
// //INDEX - shows all campgrounds
// app.get("/campgrounds", function(req, res){
// 	// res.render("campgrounds", {campgrounds: campgrounds});
// 	//Gets all campgrounds from the DB
// 	Campground.find({}, function(err, allCampgrounds){
// 		if(err){
// 			console.log(err);
// 		} else{
// 			res.render("campgrounds/index", {campgrounds: allCampgrounds});
// 		}
// 	})
// });
// //CREATE - add new campgrounds to database
// app.post("/campgrounds", function(req, res){
// 	var name= req.body.name;
// 	var image = req.body.image;
// 	var desc = req.body.description;
// 	var newCampground = {name: name, image: image, description: desc}
// 	// campgrounds.push(newCampground)
// 	//Create a new campground and save it to the DB
// 	Campground.create(newCampground, function(err, newlyCreated){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.redirect("/campgrounds");
// 		}
// 	})
// });
// //NEW- displays form to create new campground
// app.get("/campgrounds/new", function(req, res){
// 	res.render("campgrounds/new");
// });
// //SHOW - shows more info about one campground
// app.get("/campgrounds/:id", function(req, res){
// 	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
// 		if(err){
// 			console.log(err);
// 		} else{
// 			// console.log(foundCampground);
// 			res.render("campgrounds/show", {campground: foundCampground});
// 		}
// 	})
// });

// // =================
// // COMMENT ROUTES
// // =================
// app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
// 	Campground.findById(req.params.id, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.render("comments/new", {campground: campground});
// 		}
// 	});
// });
// app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
// 	Campground.findById(req.params.id, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else{
// 			Comment.create(req.body.comment, function(err, comment){
// 				if(err){
// 					console.log(err);
// 				} else{
// 					campground.comments.push(comment);
// 					campground.save();
// 					res.redirect("/campgrounds/" + campground._id);
// 				}
// 			})
// 		}
// 	})
// })
// // =================
// // AUTH ROUTES
// // =================
// //show register form
// app.get("/register", function(req, res){
// 	res.render("register");
// });
// //handles sign-up logic
// app.post("/register", function(req, res){
// 	var newUser = new User({username: req.body.username});
// 	User.register(newUser, req.body.password, function(err, user){
// 		if(err){
// 			console.log(err);
// 			return res.render("register");
// 		}
// 		passport.authenticate("local")(req, res, function(){
// 			res.redirect("/campgrounds");	
// 		})
// 	})
// });
// //show login form
// app.get("/login", function(req, res){
// 	res.render("login");
// });
// //handles login logic
// app.post("/login", passport.authenticate("local",
// 	{
// 		successRedirect: "/campgrounds",
// 		failureRedirect: "/login"
// 	}), function(req, res){
// });
// app.get("/logout", function (req, res){
// 	req.logout();
// 	res.redirect("/campgrounds")
// });
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// };