const mongoose = require('mongoose');
const Review = require('./reviews')
const campgroundSchema = mongoose.Schema({
    title:String,
    images:String,
    price:Number,
    description:String,
    location:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

campgroundSchema.post('findOneAndDelete',  async function(doc){
    if(doc.reviews.length){
       const delReviews= await Review.deleteMany({_id: {$in:doc.reviews}})
       console.log(delReviews)
    } 
})

const Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;