var express = require("express");
var app = express();
var bodyPaser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");


var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index")
var seedDB = require("./seeds")
// seedDB();

mongoose.connect("mongodb+srv://greatlim:qq789789@cluster0-kbrnw.mongodb.net/yelp_camp?retryWrites=true", {
    useNewUrlParser: true
});
app.use(bodyPaser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())

app.use(require("express-session")({
    secret: "I'm hungry",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);


app.listen(3000, function () {
    console.log("the YelpCamp server has started!");
});