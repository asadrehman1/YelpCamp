if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user');
const localStrategy = require('passport-local');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const {campgroundSchema , reviewSchema} = require('./models/schemas')
const Review = require('./models/reviews')
const bodyParser = require('body-parser');
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');
const { findByIdAndUpdate } = require('./models/campground');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
app.use(cors());

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log("Mongoose Connection Open!")
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

app.set('view engine', 'ejs');
app.set('views' , path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7,}
  }))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.messages = req.flash('success');
    res.locals.errors = req.flash('errors');
    next();
})
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/review',reviewsRoutes);
app.use('/api/campgrounds', require("./routes/api/campgrounds"));
app.use('/api/auth', require("./routes/api/auth"));
app.use('/',usersRoutes);
app.use(express.static(path.join(__dirname,'public')));
// const sessionConfig = {
//     secret: 'thisisnotagoodsecret',
//     resave: false,
//     saveUninitialized:true,
//     cookie:{
//         expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge:1000 * 60 * 60 * 24 * 7,
//     }
// }
// app.use(session(sessionConfig));
// app.set('trust proxy', 1)
// const validateCampground = (req,res,next)=>{
//    const {error} = campgroundSchema.validate(req.body);
//    if(error){
//     const msg = error.details.map(el =>el.message).join(',');
//     throw new ExpressError(msg,400);
//    }else{
//     next();
//    }
// }

// const validateReview = (req,res,next)=>{
//     const {error} = reviewSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(er =>er.message).join(',');
//         throw new ExpressError(msg,400);
//     }
//     else{
//         next();
//     }
// }
app.get('/',(req,res)=>{
    res.render('home')
})
// app.get('/campgrounds',async(req,res)=>{
//    const campgrounds = await Campground.find({});
//    res.render('campgrounds/index',{campgrounds})
// })

// app.get('/campgrounds/new',(req,res)=>{
//     res.render('campgrounds/new')
// })

// app.post('/campgrounds',validateCampground,catchAsync(async(req,res,next)=>{
//         // if(!req.body.campground) throw new ExpressError("Invalid Camoground Data!",400);
//         const campground = new Campground(req.body.campground)
//         campground.save();
//         res.redirect(`/campgrounds/${campground._id}`)
// }))

// app.get('/campgrounds/:id',async(req,res)=>{
//     const {id} = req.params;
//     const campground = await Campground.findById(id).populate('reviews');
//     res.render('campgrounds/details',{campground})
//  })

// app.get('/campgrounds/:id/edit',async(req,res)=>{
//    const {id} = req.params; 
//     const updatedCamp = await Campground.findById(id);
//     res.render('campgrounds/edit',{updatedCamp})
// })

// app.put('/campgrounds/:id', validateCampground,catchAsync(async(req,res)=>{
//     const {id} = req.params;
//     const updatedCamp = await Campground.findByIdAndUpdate(id , req.body.campground)
//     res.redirect(`/campgrounds/${updatedCamp._id}`)
// }))                                                                    

// app.delete('/campgrounds/:id',async(req,res)=>{
//     const deletedCamp = await Campground.findByIdAndDelete(req.params.id)
//     res.redirect('/campgrounds')
// })

// app.post('/campgrounds/:id/review',validateReview,catchAsync(async(req,res)=>{
//     const camp = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review)
//     camp.reviews.push(review);
//     await review.save();
//     await camp.save();
//     res.redirect(`/campgrounds/${camp._id}`)
// }))

// app.delete('/campgrounds/:id/review/:reviewId',catchAsync(async(req,res)=>{
//     const {id,reviewId} = req.params;
//    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//    await Review.findByIdAndDelete(reviewId);
//    res.redirect(`/campgrounds/${id}`);
// }))

app.all('*',(req,res,next)=>{
   next(new ExpressError("Page not found!",404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500 , message="Something went wrong!!!"} = err;
    res.status(statusCode).render('error',{err})
})
app.listen(9000,()=>{
    console.log("Serving on port 9000!")
})