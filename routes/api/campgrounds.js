const express = require('express');
const router = express.Router();
const Campground = require('../../models/campground');
const catchAsync = require("../../utils/catchAsync");
const ExpressError = require("../../utils/ExpressError");
const {isLoggedIn,validateCampground,isAuthor,apiauth} = require('../../middleware');
const multer  = require('multer');
const {storage} = require("../../cloudinary/index")
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
    res.send(campgrounds)
 })
//  
 router.post('/',upload.single("images"),catchAsync(async(req,res,next)=>{
        // if(!req.body.campground) throw new ExpressError("Invalid Camoground Data!",400);
        const campground = new Campground(req.body);
        campground.images = req.file.path;     
        await campground.save();                
        res.send(campground);                   
 }))

 router.get('/:id',async(req,res)=>{
     const {id} = req.params;
     const campground = await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
     res.send(campground) 
  })
 
 router.put('/:id', upload.single("images"),catchAsync(async(req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    camp.title = req.body.title;
    camp.location = req.body.location;
    camp.price = req.body.price;
    camp.description = req.body.description,
    camp.images = req.file.path;
    await camp.save();
    res.send(camp)
    console.log(req.body,req.file)
 }))                                                                    
 
 router.delete('/:id',catchAsync(async(req,res)=>{
     const deletedCamp = await Campground.findByIdAndDelete(req.params.id);
     return res.send(deletedCamp);
 }))

module.exports = router;