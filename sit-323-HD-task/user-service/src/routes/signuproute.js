const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const controller = require('../controllers/signupController');

app.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())
app.use(router);

router.post('/api/account', (req, res) => {
    let account = req.body;
    console.log(account);
    controller.createAccount(account,res);
});


module.exports = {
    signuproute: router }; 