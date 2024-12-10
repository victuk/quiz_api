var express = require('express');
const userModel = require('../models/usersModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

var router = express.Router();

/* GET home page. */
router.post('/register', async function (req, res, next) {
  const { fullName, email, password } = req.body;

  console.log(req.body);

  const {error} = Joi.object({
    fullName: Joi.string().min(5).required().messages({
      'string.base': 'Full name must be a string.',
      'string.empty': 'Full name cannot be empty.',
      'string.min': 'Full name must be at least 5 characters long.',
      'any.required': 'Full name is required.'
    }),
    email: Joi.string().email({tlds: {allow: ["com", "net"]}}).required().messages({
      'string.base': 'Email must be a string.',
      'string.empty': 'Email cannot be empty.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.'
    }),
    password: Joi.string().min(8).alphanum().required().messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.alphanum': 'Password must be alphanumeric.',
      'any.required': 'Password is required.'
    })
  }).validate({
    fullName, email, password
  });

  if(error) {
    res.status(400).send({
      message: error.message
    });
    return;
  }

  const userAlreadyExist = await userModel.exists({email});

  if(userAlreadyExist) {
    res.status(409).send({
      message: "User already exist"
    });
    return;
  }

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

  const {error} = Joi.object({
    email: Joi.string().email({tlds: {allow: ["com", "net"]}}).required().messages({
      'string.base': 'Email must be a string.',
      'string.empty': 'Email cannot be empty.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.'
    }),
    password: Joi.string().min(8).alphanum().required().messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.alphanum': 'Password must be alphanumeric.',
      'any.required': 'Password is required.'
    })
  }).validate({email, password});

  if(error) {
    res.status(400).send({
      message: error.message
    });
    return;
  }

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
