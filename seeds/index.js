const mongoose = require('mongoose');
const cities = require('../cities');
const Campground = require('../models/campground');
const User = require('../models/user');
const {descriptors,places} = require('./seedHelpers');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log("Mongoose Connection Open!")
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}
const saveData = (array)=>{
  return array[Math.floor(Math.random() * array.length)]
}
const seedDb = async()=>{
   for(let i=0;i<50;i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
        author:"637b8a4137c9e8e353ff209f",
        location : `${cities[random1000].city},${cities[random1000].state}`,
        title:`${saveData(descriptors)} ${saveData(places)}`,
        description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea repellendus, quo, blanditiis sed quaerat fugit veritatis aut enim accusantium nulla impedit? Assumenda, repellat? Saepe mollitia, non quam ipsum quos magni?',
        price,
        images:'https://res.cloudinary.com/ds7dqtubs/image/upload/v1671974923/YelpCamp/wdwceqof5szlzrtkxlgv.jpg'
    })
    await camp.save();
}
//  await Campground.deleteMany({})
}

seedDb().then(()=>{
    mongoose.connection.close();
})