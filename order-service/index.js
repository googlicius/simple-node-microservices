const express = require('express');
const RabbitMQClient = require('../utils/rabbitmq/client');
const { v4: uuidv4 } = require('uuid');

const app = express();
const rabbitMQ = new RabbitMQClient();
const REQUEST_QUEUE = 'data_request';

async function initialize() {
    await rabbitMQ.connect();
    await rabbitMQ.createQueue(REQUEST_QUEUE);
}

initialize();

const orders = [{ id: 1, userId: 1, productId: 1 }];

app.get('/', async (req, res) => {
    // Send request to Service B
    const response = await rabbitMQ.sendMessage(REQUEST_QUEUE, {
        action: 'getData',
        parameters: req.query
    });

    console.log('Response', response);

    res.json(orders);
});

const PORT = +process.env.ORDER_SERVICE_PORT || 3003;

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
