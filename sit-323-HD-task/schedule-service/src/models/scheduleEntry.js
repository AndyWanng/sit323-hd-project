const { connectDB } = require('./mongodb');

let scheduleCollections;

const initialize = async () => {
    if (!scheduleCollections) {
        const client = await connectDB();
        scheduleCollections = client.db('SmartTravel').collection('schedule');
    }
};

const userSchedules = async (schedule, res) => {
    await initialize();
    scheduleCollections.insertOne(schedule, (err, result) => {
        if (err) {
            console.error('Error creating schedule entry:', err);
            res.send({result:500});
        } else {
            console.log('Congrats, your entry has been created!');
            res.send({result:200});
        }
    });
};

const getSchedules = async (res) => {
    await initialize();
    scheduleCollections.find({}).toArray((err, schedules) => {
        if (err) {
            console.error('Error retrieving schedules:', err);
            res.status(500).send({result: 'Error retrieving schedules'});
        } else {
            res.status(200).send(schedules);
        }
    });
};

module.exports = { userSchedules, getSchedules };