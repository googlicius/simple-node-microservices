const express = require('express');
const app = express();

const users = [{ id: 1, name: 'John Doe' }];

app.get('/', (req, res) => {
    res.json(users);
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
