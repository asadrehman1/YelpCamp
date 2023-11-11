var express = require("express");
var router = express.Router();
var Campgrounds = require("../../../models/campground");

router.get("/", async function (req, res, next) {
  console.log("inside");
  setTimeout(async () => {
    let campgrounds = await Campgrounds.find();

    res.send(campgrounds);
  }, 5000);
});
module.exports = router;
