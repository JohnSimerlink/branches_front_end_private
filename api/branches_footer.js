const express = require('express');
const app = express();
const paymentHandler = require('./payment-handler');

// Server side dependencies: stripe, express
app.get('/', paymentHandler);
app.listen(3000, () => console.log('Example app listening on port 3000!')); 