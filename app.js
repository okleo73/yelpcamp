// Variables
require('dotenv').config();
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