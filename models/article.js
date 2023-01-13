'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
    title: String,
    description: String,
    price: String,
    date: { type: Date, default: Date.now },
    image: String,
    link: String,
    code: String, //Codigo del articulo, esto en caso de que el vendedor tenga su propia identificacion
    status: Boolean
});

module.exports = mongoose.model('Article', ArticleSchema);
// articles --> guarda documen