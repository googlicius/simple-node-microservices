const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy routes
app.use('/users', createProxyMiddleware({ 
	target: 'http://localhost:3001', changeOrigin: true }));
app.use('/catalog', createProxyMiddleware({ 
	target: 'http://localhost:3002', changeOrigin: true }));
app.use('/orders', createProxyMiddleware({ 
	target: 'http://localhost:3003', changeOrigin: true }));

const PORT = 3000;

app.listen(PORT, () => {
	console.log('API Gateway running on port ' + PORT);
});
