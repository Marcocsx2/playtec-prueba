//Archivos de configuración
require('./config/config');

//Conexión con la BD
require('./database/conexion');

//Importaciones necesarias
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//Parse application/json
app.use(bodyParser.json());

//Configuración global de rutas
app.use(require('./routes/index'));

//Escuchamos al puerto que definimos en la configuración
app.listen(process.env.PORT , () => {
    console.log(`Escuchando al puerto ${process.env.PORT}`);
})
