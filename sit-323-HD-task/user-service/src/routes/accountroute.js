// accountRoute.js
const express = require('express');
const { getUserInfo, updateUser, getUserJournals } = require('../controllers/accountController');

const router = express.Router();

router.get('/info/:userId', getUserInfo);
router.post('/update/:userId', updateUser);
router.get('/journals/:userId', getUserJournals);

module.exports = {
    accountroute: router
};
