require('dotenv').config();
const config = require('config');
const cors = require('cors');

require('./db/connectDB');

// Routes import
const signup = require("./routes/signup");
const signIn = require("./routes/signIn");
const google = require("./google/google");
const facebook = require("./facebook/facebook");
const forgotPassword = require('./routes/forgotPassword');


const express = require("express");
const app = express();
app.use(cors());
app.use(express.json()); 


require('./google/passport-setup');
require('./facebook/passport-setup');


if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1); // 0 means success anything else means failure, so if jwtPrivateKey is not set we get error and process exit, test this
}


app.get('/',function(req,res){
    res.send('Welcome to login signup page! Please login to continue.');
});  


app.use("/api/signup", signup);
app.use("/api/signIn", signIn);
app.use("/", google);
app.use("/", facebook);

app.use('/api',forgotPassword);


app.get('/logout',(req,res)=>{
    req.session = null;
    req.logOut();
    res.redirect('/');
})

  
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));