const Joi = require("joi");
const config = require('config');
const jwt = require('jsonwebtoken');  
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
      },
      phone: {
        type: Number,
        minlength: 10,
        maxlength: 10,
        required: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
      },
      grade: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1,
      },
      class: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 2,
      },
      dateOfBirth:{     // to work on this
        type: Date,
        required: true,
      },
    },
  );

  userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id},config.get('jwtPrivateKey')); 
    return token;
  }  

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    password: Joi.string().min(5).max(255).required(),
    grade: Joi.string().min(1).max(1).required(),
    class: Joi.string().min(1).max(2).required(),
    name: Joi.string().min(3).max(50).required(),
    dateOfBirth: Joi.date().iso().required(),   // to work on this
    email: Joi.string().regex(/^(([a-zA-Z0-9 _ - .]{1,255})+)@(([a-zA-Z0-9]{1,255})+).([a-z]{2,6})$/)
    .required().email().error(() => {
      return {
        message: 'Invalid email-id format!',
      };
    }),
    phone: Joi.number().min(1000000000).max(9999999999).required().error(() => {
      return {
        message: 'Invalid contact number!',
      };
    })
  };

  return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser;
exports.userSchema = userSchema;
  