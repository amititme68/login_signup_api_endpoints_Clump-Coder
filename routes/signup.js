const bcrypt = require("bcrypt");
const { User, validate } = require("../model/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  // validate a requests,if its not valid return 400 otherwise create a new user and save to db
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validation if user is not already registered
  let user = await User.findOne(
    { email: req.body.email } || { phone: req.body.phone }
  );
  
  if (user)
    return res.status(400).send(
        "Try any other email or phone number, this email or phone number is already registered!"
      );

  // At this point we have a valid user object, hence save this into db
  user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    grade: req.body.grade,
    class: req.body.class,
    dateOfBirth: req.body.dateOfBirth,
  });

   const salt = await bcrypt.genSalt(10); // here
   user.password = await bcrypt.hash(user.password, salt); // reset it at lhs

  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(user);
});

module.exports = router;
