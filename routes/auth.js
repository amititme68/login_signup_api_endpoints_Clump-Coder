const Joi = require("joi");
const bcrypt = require('bcrypt');   // import also
const { User } = require("../model/user");// we need a separate validate fn for this module
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email } || {phone:req.body.phone});
  if (!user) return res.status(400).send("Invalid email or phone or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send("Invalid email or phone or password");

  const token = user.generateAuthToken();
  res.send(token);  

});

function validate(user) {
    const schema = {
      email: Joi.string().regex(/^(([a-zA-Z0-9 _ - .]{1,255})+)@(([a-zA-Z0-9]{1,255})+).([a-z]{2,6})$/)
      .email().error(() => {
      return {
        message: 'Invalid email-id format!',
      };
     }),
     phone: Joi.number().min(1000000000).max(9999999999).error(() => {
        return {
          message: 'Invalid contact number!',
        };
      }),
     password: Joi.string().min(5).max(255).required(), 
    };
    return Joi.validate(user, schema);
}

module.exports = router;
