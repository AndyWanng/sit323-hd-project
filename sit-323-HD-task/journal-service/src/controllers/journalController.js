const accountDB = require('../models/journalEntry');

const createJournal = (journal,res) => {
    accountDB.userJournals(journal,res);
};
const getJournalEntries = (res) => {
    accountDB.getJournals(res);
};

module.exports = {
    createJournal,
    getJournalEntries
}