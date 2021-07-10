const express = require("express");
const router = express.Router();
const passport = require('passport');
const session = require('express-session');


const isLoggedIn = (req,res,next)=>{
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
        res.redirect('/');
    }
}

router.use(session({secret: "thisissecretkey"}));

router.use(passport.initialize());
router.use(passport.session());


// API endpoint for sign-in with facebook
router.get('/facebook',passport.authenticate('facebook', { scope:'email,user_photos'}));

router.get('/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/failed' }),
    function(req, res) {
       res.redirect('/profile');
});

router.get('/failed',function(req,res){ 
    res.status(404).send('You failed to log in!');
});

router.get('/profile',isLoggedIn,function(req,res){
    res.send("You are a valid user");
});


module.exports = router;