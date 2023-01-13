'use strict'

//Cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');
//const bodyParser = require('body-parser');

//Ejecutar express (http)
var app = express();

//Cargar ficheros de rutas
var article_routes = require('./routes/article');

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Añadir prefijos a rutas / cargar rutas
app.use('/api',article_routes);

//Ruta o metodo de prueba para el API REST

//Exportar módulo (fichero actual)
module.exports = app;