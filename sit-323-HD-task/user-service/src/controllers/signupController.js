const accountDB = require('../models/userEntry');

const createAccount=(account,res) => {
    accountDB.userAccounts(account,res);
}

module.exports ={
    createAccount
}