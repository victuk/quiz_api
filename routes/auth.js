var express = require('express');
const userModel = require('../models/usersModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var router = express.Router();

/* GET home page. */
router.post('/register', async function (req, res, next) {
  const { fullName, email, password } = req.body;

  console.log(req.body);

  const hashedPassword = bcrypt.hashSync(password, 10);

  await userModel.create({
    fullName, email, password: hashedPassword
  });

  res.status(201).send({
    message: "Created"
  });

});


router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;

  // find, findOne, findById, findByIdAndUpdate, findOneAndUpdate
  // updateMany, deleteMany, countDocuments, findByIdAndDelete, findOneAndDelete,
  // distinct

  const userDetails = await userModel.findOne({ email });

  if (!userDetails) {
    res.status(404).send({
      message: "User not found"
    });
    return;
  }

  const passwordsMatch = bcrypt.compareSync(password, userDetails.password);

  if (!passwordsMatch) {
    res.status(401).send({
      message: "Password is incorrect"
    });
    return;
  }

  const token = jwt.sign({
    userId: userDetails._id,
    fullName: userDetails.fullName,
    email: userDetails.email,
    role: userDetails.role
  }, process.env.AUTH_SECRET);

  res.send({
    message: "Login successful",
    userDetails: {
      fullName: userDetails.fullName,
      email: userDetails.email,
      role: userDetails.role
    },
    token
  });
});

module.exports = router;
