const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require("../utils/catchAsync");

router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register', catchAsync(async(req,res)=>{
   try{
    const {username , email , password} = req.body;
    const user = new User({email,username});
    // console.log(user.email)
    const registerdUser = await User.register(user,password);
    req.login(registerdUser, err =>{
      if(err) return next(err)
      req.flash("success","Welcome to the YelpCamp!");
      res.redirect('/campgrounds');
    })
   }
   catch(e){
    req.flash("error",e.message);
    res.redirect("/register")
   }
}));

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',passport.authenticate('local',{failureFlash: true , failureRedirect:'/login'}) , (req,res)=>{
   req.flash('success','Welcome Back!');
   const redirectUrl = req.session.returnTo || "/campgrounds";
   delete req.session.returnTo;
   res.redirect(redirectUrl);
})

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success","Goodbye!")
      res.redirect('/campgrounds');
    });
  });
  
module.exports = router;