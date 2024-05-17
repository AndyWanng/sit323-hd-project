const express = require('express');
const app = express();
const PORT = process.env.PORT || 8082;
const bodyParser = require('body-parser');
const Routes = require('./src/routes');
const { connectDB } = require('./src/models/mongodb');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

app.use('/journal', Routes.Journal.journalroute);
app.get('/healthz', (req, res) => {
    res.send('OK');
});
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Journal service started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

startServer();
