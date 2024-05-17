const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const controller = require('../controllers/loginController');

router.use(bodyParser.json());

router.post('/api/verify', (req,res)=>{
    let account = req.body;
    console.log(account);
    controller.verifyAccount(account,res);
});

module.exports = {
    loginroute: router
};