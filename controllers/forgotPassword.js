const { User } = require("../model/user");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const mailgun = require("mailgun-js");
const { response } = require("express");
const DOMAIN = "sandbox062046c4043a4a4a92ea6318903df662.mailgun.org";
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });


exports.forgotPassword = async function(req, res){
    const {email} = req.body;// here we receive the email from the req.body
    // Now check if this user exists or not
    // if error or user doesnot exist
    if (req.body.error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("User with this email does not exist.");
  
    // Here after reaching, user exist in our database jwt.sign by id here
   // We have only email so pass that only below
    const token = jwt.sign({_id: user._id}, process.env.JWT_RESET_ACCOUNT,{ expiresIn: "20m" });
  
    const data = {
      from: "noreply@hello.com", 
      to: email, // email that we have got in req.body
      subject: "Account Activation Link",
      html: ` 
              <h2> Please Click on the given link to reset your password </h2>
              <p>${process.env.CLIENT_URL}/resetpassword/${token}</p> 
          `
    };
      return await User.updateOne({resetLink: token}, function(err, success){
        if(err){
          return res.status(400).json({error:"reset password link error"});
        }else {
          mg.messages().send(data, function (error, body) {
            if (error) {
              return res.json({
                error: err.message,
              });
            }
            return res.json({
              message: "Email have been sent, kindly follow the instructions",
            });
          });
        }
      })
  
  }
  // From client side we will pass an email to this above endpoint, this function is responsible for sending an email
  // to a particular user with a token 
  
  exports.resetPassword = async function (req, res){
    // in this function we will receive a new password as well as token
    const {resetLink, newPass} = req.body;
    if(resetLink){
      jwt.verify(resetLink, process.env.JWT_RESET_ACCOUNT, async function(err, decodedData){
        if (err) {
          return res.status(401).json({
            error: "Incorrect token or it is expired.",
          });
        }
        await User.findOne({resetLink},(err, user)=>{  //reset link we are getting from client side 
          if(err || !user){
            return res.status(400).json({error: "User with this token does not exist."});
          }
          const obj = {
            password : newPass,
            resetLink : ''  // after updating the password in db make reset lik empty
          }
  
          user = _.extend(user, obj);
          user.save((err, result)=>{
  
            if(err){
              return res.status(400).json({error:"reset password error"});
            }else {
                return res.status(200).json({message: "Your password has been changed"});
            }  
          })
        })
      })
    }
    else{
        return res.status(401).json({error: "Authentication error!"});
    }
  }