const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const USER_SERVICE_HOST = process.env.USER_SERVICE_HOST || 'localhost';
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT || 3001;
const CATALOG_SERVICE_HOST = process.env.CATALOG_SERVICE_HOST || 'localhost';
const CATALOG_SERVICE_PORT = process.env.USER_SERVICE_PORT || 3002;
const ORDER_SERVICE_HOST = process.env.ORDER_SERVICE_HOST || 'localhost';
const ORDER_SERVICE_PORT = process.env.ORDER_SERVICE_PORT || 3003;

const app = express();

app.get('/health', (req, res) => {
	res.send('API Gateway is running!');
});

// Proxy routes
app.use('/users', createProxyMiddleware({ 
	target: `http://${USER_SERVICE_HOST}:${USER_SERVICE_PORT}`, changeOrigin: true }));
app.use('/catalog', createProxyMiddleware({ 
	target: `http://${CATALOG_SERVICE_HOST}:${CATALOG_SERVICE_PORT}`, changeOrigin: true }));
app.use('/orders', createProxyMiddleware({ 
	target: `http://${ORDER_SERVICE_HOST}:${ORDER_SERVICE_PORT}`, changeOrigin: true }));

const PORT = 3000;

app.listen(PORT, () => {
	console.log('API Gateway running on port ' + PORT);
});
