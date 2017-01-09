const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());
// Set up routes.
app.use('/api', require(path.join(__dirname, 'routes/api')));

module.exports = app;
