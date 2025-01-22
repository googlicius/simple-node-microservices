const express = require('express');

const app = express();

const orders = [{ id: 1, userId: 1, productId: 1 }];

app.get('/', (req, res) => {
    res.json(orders);
});

const PORT = +process.env.ORDER_SERVICE_PORT || 3003;

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
