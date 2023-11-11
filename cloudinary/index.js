const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
   cloudinary,
   params:{
    folder: "YelpCamp",
    allowedFormats: ['jpeg','png','jpg']
   }
})

const multer  = require('multer');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// })

module.exports = {
    cloudinary,
    storage
}