const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;
const bodyParser = require('body-parser');
const Routes = require('./src/routes');
const { connectDB } = require('./src/models/mongodb');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

app.use('/signup', Routes.signUP.signuproute);
app.use('/login', Routes.logIn.loginroute);
app.use('/account', Routes.account.accountroute);
app.get('/healthz', (req, res) => {
    res.send('OK');
});
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`User Authentication service started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

startServer();
