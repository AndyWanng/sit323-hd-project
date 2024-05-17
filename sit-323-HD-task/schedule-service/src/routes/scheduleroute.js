const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const controller = require('../controllers/scheduleController');

app.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())
app.use(router);

router.post('/api/schedule', (req, res) => {
    let schedule = req.body;
    console.log(schedule);
    controller.createSchedule(schedule,res);
});

router.get('/api/schedules', (req, res) => {
    controller.getScheduleEntries(res);
});


module.exports = {
    scheduleroute: router
};