require('dotenv').config();
const config = require('config');
const cors = require('cors');

const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

// Routes import
const users = require("./routes/users");
const auth = require("./routes/auth");
const google = require("./google/google");
const facebook = require("./facebook/facebook");

const express = require("express");
const app = express();

require('./google/passport-setup');
require('./facebook/passport-setup');


if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1); // 0 means success anything else means failure, so if jwtPrivateKey is not set we get error and process exit, test this
}

mongoose
  .connect("mongodb://localhost/login_signUp_application_codeClump")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => console.error("Couldnot connected to database"));



app.use(cors());
app.use(express.json()); 


app.get('/',function(req,res){
    res.send('Welcome to login signup page! Please login to continue.');
});  

app.use("/users", users);
app.use("/auth", auth);
app.use("/", google);
app.use("/", facebook);

app.get('/logout',(req,res)=>{
    req.session = null;
    req.logOut();
    res.redirect('/');
})

  
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));