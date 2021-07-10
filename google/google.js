const cookieSession = require('cookie-session');
const passport = require('passport');

const express = require("express");
const router = express.Router();


const isLoggedIn = (req,res,next)=>{
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}


router.use(cookieSession({
    name:'tuto-session',
    keys: ['key1','key2']
}))


router.use(passport.initialize());
router.use(passport.session());


// API endpoint for sign-in with google
router.get('/google',passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/success');
});

router.get('/failed',function(req,res){
    res.status(404).send('You failed to log in!');
});

router.get('/success',isLoggedIn,function(req,res){
    res.send(`Welcome Mr. ${req.user.displayName}`);
});  


module.exports = router;