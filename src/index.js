const port = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Requests to API with informations in JSON format
app.use(bodyParser.json());
// Using to send parameters in url
app.use(bodyParser.urlencoded({ extended: false})); 

require('./controller/index')(app);
app.listen(port);