const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8080;
const cors = require('cors');

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Frontend service started on port ${PORT}`);
});
