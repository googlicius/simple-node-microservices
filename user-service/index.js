const express = require('express');
const app = express();

let counter = 0;

const users = [{ id: 1, name: 'John Doe' }];

app.get('/', (req, res) => {
    res.json(users);
});

app.get('/should-error', (req, res) => {
    if (counter < 5) {
        counter++;
        res.status(500).send('Internal Server Error');
    }
    else {
        res.json({
            message: 'This will error in 5th request',
            path: req.path,
        });
    }
});

const PORT = +process.env.USER_SERVICE_PORT || 3001;

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
