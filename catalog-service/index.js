const express = require('express');
const RabbitMQClient = require('../utils/rabbitmq/client');

const rabbitMQ = new RabbitMQClient();
const REQUEST_QUEUE = 'data_request';

async function initialize() {
	await rabbitMQ.connect();
	await rabbitMQ.createQueue(REQUEST_QUEUE);

	// Listen for requests and return response directly
	await rabbitMQ.consumeMessage(REQUEST_QUEUE, handleRequest);
}

async function handleRequest(request) {
	// Handle different types of requests
	switch (request.action) {
		case 'getData':
			return {
				message: 'Here is your data',
				timestamp: new Date(),
				parameters: request.parameters
			};
		default:
			throw new Error('Unknown action');
	}
}

initialize();

const app = express();

const catalog = [{ id: 1, name: 'Product A', price: 100 }];

app.get('/', (req, res) => {
	res.json(catalog);
});

const PORT = +process.env.CATALOG_SERVICE_PORT || 3002;

app.listen(PORT, () => {
	console.log('Catalog Service running on port ' + PORT);
});
