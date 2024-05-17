const accountDB = require('../models/userEntry');

const getUserInfo = (userId, res) => {
    accountDB.userInfo(userId, res);
};

const updateUser = (userId, newData, res) => {
    accountDB.updateUserInfo(userId, newData, res);
};

const getUserJournals = (userId, res) => {
    accountDB.getUserJournals(userId, res);
};

module.exports = {
    getUserInfo,
    updateUser,
    getUserJournals
}
