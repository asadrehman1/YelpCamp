const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campground');
const Review = require('../models/reviews')
const {reviewSchema} = require('../models/schemas')
const {isLoggedIn,isReviewAuthor} = require("../middleware")


const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(er =>er.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}
router.post('/',isLoggedIn,validateReview,catchAsync(async(req,res)=>{
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
}))
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async(req,res)=>{
    const {id,reviewId} = req.params;
   await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;