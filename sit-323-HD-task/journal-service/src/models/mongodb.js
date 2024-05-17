const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://rootuser:rootpass@mongodb:27017/SmartTraveller?authSource=admin";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client;
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
    }
};

module.exports = { connectDB };
