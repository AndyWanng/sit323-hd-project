const accountDB = require('../models/userEntry');

const verifyAccount = (account,res) => {
    accountDB.verify(account,res);
};

module.exports = {
    verifyAccount
}