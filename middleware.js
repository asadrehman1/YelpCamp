const {campgroundSchema} = require('./models/schemas');
const ExpressError = require("./utils/ExpressError");
const Campground = require('./models/campground');
const Review = require('./models/reviews');
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require('./models/user')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("errors","You must be signed in!");
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
     const msg = error.details.map(el =>el.message).join(',');
     throw new ExpressError(msg,400);
    }else{
     next();
    }
 }

 module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const updatedCamp = await Campground.findById(id);
    if(!updatedCamp.author.equals(req.user._id)){
        req.flash("errors","You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("errors","You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.apiauth= async(req, res, next)=>{
    const token = req.header("x-auth-token");
  
    if (!token) return res.status(401).send("Access denied. No token provided.");
  
    try {
      const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  
      const user = await User.findById(decoded._id).select("-password");
      if (!user) return res.status(400).send("Invalid token: User Dont exist");
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong at server");
    }
  }