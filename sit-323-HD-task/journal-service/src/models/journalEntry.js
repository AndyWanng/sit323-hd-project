const { connectDB } = require('./mongodb');

let journalCollections;

const initialize = async () => {
    if (!journalCollections) {
        const client = await connectDB();
        journalCollections = client.db('SmartTravel').collection('journal');
    }
};

const userJournals = async (journal, res) => {
    await initialize();
    journalCollections.insertOne(journal, (err, result) => {
        if (err) {
            console.error('Error creating journal entry:', err);
            res.send({result:500});
        } else {
            console.log('Congrats, your entry has been created!');
            res.send({result:200});
        }
    });
};

const getJournals = async (res) => {
    await initialize();
    journalCollections.find({}).toArray((err, journals) => {
        if (err) {
            console.error('Error retrieving journals:', err);
            res.status(500).send({result: 'Error retrieving journals'});
        } else {
            res.status(200).send(journals);
        }
    });
};

module.exports = { userJournals, getJournals };