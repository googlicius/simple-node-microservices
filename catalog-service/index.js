const express = require('express');

const app = express();

const catalog = [{ id: 1, name: 'Product A', price: 100 }];

app.get('/catalog', (req, res) => {
	res.json(catalog);
});

const PORT = 3002;

app.listen(PORT, () => {
	console.log('Catalog Service running on port ' + PORT);
});
