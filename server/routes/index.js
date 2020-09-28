const express = require('express');
const app = express();
const cors = require('cors');
//habilitamos cors
app.use(cors());

// Autenticación con firebase Google
app.use(require('./authentication'));

// Subir archivo a google drive
app.use(require('./uploadDrive'));


module.exports = app;