const express = require('express');

const app = express();

const orders = [{ id: 1, userId: 1, productId: 1 }];

app.get('/orders', (req, res) => {
    res.json(orders);
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
