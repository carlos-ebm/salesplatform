'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

/*mongoose.set('useFindAndModify', false);*/
mongoose.Promise = global.Promise;
//mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/api_rest_salesplatform', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('La conexión a la base de datos se ha sido exitosa!!!.');

        // Crear servidor y ponerme a escuchar HTTP
        app.listen(port, () => {
            console.log('Servidor corriendo http://localhost:'+port);
        }); 

    })