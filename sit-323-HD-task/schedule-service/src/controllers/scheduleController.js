const accountDB = require('../models/scheduleEntry');

const createSchedule = (schedule,res) => {
    accountDB.userSchedules(schedule,res);
};
const getScheduleEntries = (res) => {
    accountDB.getSchedules(res);
};

module.exports = {
    createSchedule,
    getScheduleEntries
}