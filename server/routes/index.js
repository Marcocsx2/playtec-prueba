const express = require('express');
const app = express();
const cors = require('cors');
//habilitamos cors
app.use(cors());

// Autenticación con firebase Google
app.use(require('./authentication'))


module.exports = app;