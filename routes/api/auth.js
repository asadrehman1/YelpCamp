const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");
const bcrypt = require("bcryptjs");

router.post('/register',async(req,res)=>{
    let findUser = await User.findOne({
    email: req.body.email,
  });

  if(findUser) return res.status(400).send("User with given name is already exist");
    const {username , password ,email} = req.body;
    const hash = await bcrypt.hash(password,10);
    const user = new User({
        username,
        email,
        password:hash
    })
    await user.save();

    const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        config.get("jwtPrivateKey")
      );

    const dataToReturn = {
        name:user.name,
        email:user.email,
        token:user.token
    }

    res.send(dataToReturn);
})

router.post("/login", async function (req, res, next) {
  let user = await User.findOne({
    username: req.body.email
  });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid Password");
  }
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    config.get("jwtPrivateKey")
  );
  return res.send(token);
});

module.exports = router;
