const passport = require('passport');
require('dotenv').config();
const config = require('config');
const cors = require('cors');
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
const cookieSession = require('cookie-session');
require('./passport-setup');
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const app = express();

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1); // 0 means success anything else means failure, so if jwtPrivateKey is not set we get error and process exit, test this
}

app.use(cors());
app.use(express.json()); 
app.use(cookieSession({
    name:'tuto-session',
    keys: ['key1','key2']
}))

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req,res,next)=>{
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}

  
mongoose
  .connect("mongodb://localhost/login_signUp_application_codeClump")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => console.error("Couldnot connected to database"));


 
app.get('/',function(req,res){
    res.send('You are not logged in!');
});  

app.get('/failed',function(req,res){
    res.status(404).send('You failed to log in!');
});

app.get('/success',isLoggedIn,function(req,res){
    res.send(`Welcome Mr. ${req.user.displayName}`);
});

// API endpoint for sign-in with google
app.get('/google',passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/success');
  });


app.use("/users", users);
app.use("/auth", auth);

  
app.get('/logout',(req,res)=>{
    req.session = null;
    req.logOut();
    res.redirect('/');
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));