const express = require("express");
const router = express.Router();

//import controller
const {forgotPassword, resetPassword} = require('../controllers/forgotPassword');

router.put('/forgot-password',forgotPassword);
router.put('/reset-password',resetPassword);

module.exports = router;    