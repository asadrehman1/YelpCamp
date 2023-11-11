const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campground');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const multer  = require('multer');
const {storage} = require("../cloudinary/index")
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'public/data/uploads')
//     },
//     filename:function(req,file,cb){
//         cb(null , Date.now()+'_'+file.originalname)
//     }
// })
const upload = multer({storage})

router.get('/',async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
 })
 
 router.get('/new',isLoggedIn,(req,res)=>{
     res.render('campgrounds/new')
 })
 
 router.post('/',isLoggedIn,upload.single("images"),validateCampground,catchAsync(async(req,res,next)=>{
         // if(!req.body.campground) throw new ExpressError("Invalid Camoground Data!",400);
         const campground = new Campground(req.body.campground);
         campground.images = req.file.path
         campground.author = req.user._id;
         await campground.save();
         console.log(campground)
         req.flash('success','Successfully made a campground!')
         res.redirect(`/campgrounds/${campground._id}`)
 }))

 router.get('/:id', isLoggedIn ,async(req,res)=>{
     const {id} = req.params;
     const campground = await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
     console.log(campground);
     if(!campground){
        req.flash('errors',"Cannot find campground!");
        return res.redirect('/campgrounds')
     }
     res.render('campgrounds/details',{campground})
  })
 
 router.get('/:id/edit',isLoggedIn, isAuthor ,async(req,res)=>{
    const {id} = req.params; 
     const updatedCamp = await Campground.findById(id);
     if(!updatedCamp){
        req.flash('errors',"Cannot find campground!");
        return res.redirect('/campgrounds')
     }
     res.render('campgrounds/edit',{updatedCamp})
 })
 
 router.put('/:id',isLoggedIn,isAuthor, upload.single("images"),validateCampground,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id , {...req.body.campground});
    const imgs = req.file.path
    camp.images = imgs
    await camp.save();
     req.flash('success','Successfully updated campground!')
     res.redirect(`/campgrounds/${camp._id}`)
 }))                                                                    
 
 router.delete('/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
     const deletedCamp = await Campground.findByIdAndDelete(req.params.id);
     req.flash('success','Successfully deleted campground!')
     res.redirect('/campgrounds')
 }))

module.exports = router;