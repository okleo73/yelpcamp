var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	location: String,
    lat: Number,
    lng: Number,
	createdAt: { type: Date, default: Date.now },
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment",
	}],
});
module.exports = mongoose.model("Campground", campgroundSchema);

// var campgrounds = [
// 		{name: "Salmon Creek", image:"https://pixabay.com/get/55e8dc404f5aab14f6da8c7dda793f7f1636dfe2564c704c722a7ad7964ccc59_340.jpg"},
// 		{name: "Granite Hill", image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722a7ad7964ccc59_340.jpg"},
// 		{name: "Mountain Goat's Rest", image:"https://pixabay.com/get/57e0d6424b56ad14f6da8c7dda793f7f1636dfe2564c704c722a7ad7964ccc59_340.jpg"},
// 	];
// mongoose.connect("mongodb://localhost/yelp_camp");

// Campground.create({
// 	name: "Granite Hill", 
// 	image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722a7ad7964ccc59_340.jpg",
// 	description: "This is a huge franite hill, no bathrooms. No water. Beautiful granite!",
// }, function(err, campground){
// 	if(err){
// 		console.log(err);
// 	} else{
// 		console.log("NEWLY CREATED CAMPGROUND:");
// 		console.log(campground);
// 	}
// });