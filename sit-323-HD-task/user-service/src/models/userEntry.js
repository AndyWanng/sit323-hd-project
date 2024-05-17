const { connectDB } = require('./mongodb');
const ObjectId = require('mongodb').ObjectId;

let accountCollections;
let journalCollections;

const initialize = async () => {
    if (!accountCollections) {
        const client = await connectDB();
        accountCollections = client.db('SmartTraveller').collection('account');
        journalCollections = client.db('SmartTraveller').collection('journal');
        console.log('Database and collections initialized.');
    }
};

const userAccounts = async (account, res) => {
    await initialize();
    try {
        const exist = await accountCollections.findOne({ username: account.username });
        if (exist) {
            console.log('Account existing in the database!');
            res.send({ result: 404 });
        } else {
            const result = await accountCollections.insertOne(account);
            console.log('Insert result:', result);
            const newAccount = await accountCollections.findOne({ username: account.username });
            console.log('Newly created account:', newAccount);
            res.send({ result: 200, account: newAccount });
        }
    } catch (err) {
        console.error('Error creating account:', err);
        res.status(500).send({ result: 'Error creating account' });
    }
};

const userInfo = async (req, res) => {
    await initialize();
    const userId = req.params.userId;
    console.log('UserID:', userId);
    accountCollections.findOne({ _id: new ObjectId(userId) }, (err, userDoc) => {
        if (err) {
            console.error('Error retrieving user info:', err);
            res.status(500).send({ result: 'Error retrieving user info' });
        } else {
            res.status(200).send(userDoc);
        }
    });
};

const updateUserInfo = async (req, res) => {
    const userId = req.params.userId;
    const newData = req.body;

    await initialize();

    try {
        const userExists = await accountCollections.findOne({ _id: new ObjectId(userId) });
        if (!userExists) {
            return res.status(404).json({ message: '用户不存在' });
        }

        const updateResult = await accountCollections.updateOne(
            { _id: new ObjectId(userId) },
            { $set: newData }
        );

        if (updateResult.modifiedCount === 0) {
            throw new Error('没有文档被更新，可能是数据未变更或其他原因。');
        }

        console.log('User info updated successfully');
        res.status(200).json({ message: '用户信息更新成功' });

    } catch (error) {
        console.error('更新用户信息时出错:', error);
        res.status(500).json({ message: '更新用户信息失败', error: error.message });
    }
};

const verify = async (account, res) => {
    await initialize();
    accountCollections.findOne({ username: account.username, password: account.password }, function (err, exist) {
        if (exist) {
            console.log('User exists (success)!');
            res.send({ result: 200, userID: exist._id });
        } else {
            console.log('Unable to find (failed!)');
            res.send({ result: 404 });
        }
    });
};

const getUserJournals = async (req, res) => {
    await initialize();
    const userId = req.params.userId;
    journalCollections.find({ userID: userId }).toArray((err, journals) => {
        if (err) {
            console.error('Error retrieving journals:', err);
            res.status(500).send({ result: 'Error retrieving journals' });
        } else {
            res.status(200).send(journals);
        }
    });
};

module.exports = { userAccounts, userInfo, updateUserInfo, verify, getUserJournals };