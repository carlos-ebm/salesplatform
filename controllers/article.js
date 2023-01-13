'use strict'

var validator = require('validator');

var fs = require('fs');
var path = require('path');

const article = require('../models/article');
var Article = require('../models/article');
const { exists } = require('../models/article');

var controller = {

    /*datosCurso: (req, res) => {

        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Víctor Robles WEB',
            url: 'victorroblesweb.es',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de articulos'
        });
    },*/

    save: (req, res) => {

        //Recoger parametros por post
        var params = req.body;

        //Validar
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_description = !validator.isEmpty(params.description);
            var validate_price = !validator.isEmpty(params.price);
            var validate_image = !validator.isEmpty(params.image);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            })
        }

        if (validate_title && validate_description && validate_price && validate_image) {
            //Crear el objeto a guardar
            var article = new Article();

            //Asignar valores
            article.title = params.title;
            article.description = params.description;
            article.price = params.price;
            article.image = params.image;
            article.link = params.link;
            article.code = params.code;

            if (validator.isEmpty(params.status) == true) {
                params.status = true;
            }
            article.status = params.status;

            //Guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            })

            //Devolver una respuesta


        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos.'
            });
        }

    },

    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //Find
        Article.find({}).sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error al devolver los artículos."
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: "No hay artículos para mostrar."
                })
            }

            return res.status(200).send({
                status: 'success',
                articles
            })

        });
    },

    getArticle: (req, res) => {

        // Recoger el id de la url

        var articleId = req.params.id;

        // Comprobar que existe

        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: "No existe el articulo."
            });
        }

        // Buscar el articulo

        Article.findById(articleId, (err, article) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error al devolver los datos."
                });
            }

            if (!article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo.'
                })
            }

            // Devolverlo en json

            return res.status(200).send({
                status: 'success',
                article
            });

        });

    },

    update: (req, res) => {

        // Recoger el id del articulo por la url

        var articleId = req.params.id;

        // Recoger los datos que llegan por put

        var params = req.body;

        // Validar datos

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            })
        }

        if (validate_title && validate_content) {
            // Find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al actualizar los datos."
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo.'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                })

            });
        } else {
            // Devolver respuesta

            return res.status(404).send({
                status: 'error',
                message: 'La validación no es correcta.'
            })
        }

    },

    delete: (req, res) => {

        //Recoger el id de la url

        var articleId = req.params.id;

        //Find and delete

        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'La validación al validar los datos.'
                });
            }

            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista.'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });

        });

    },

    upload: (req, res) => {

        //Configurar el módulo connect multiparty router/article.js

        //Recoger el fichero
        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            })
        }

        //Conseguir el nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        //nombre del archivo
        var file_name = file_split[2];

        //Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        //Comprobar la extensión, solo imagenes, si es válida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //borrar el archivo
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida.'
                });
            });

        } else {
            // si todo es válido            
            // buscar el articulo, asiganrle el nombre de la imagen y actualizarlo
            var articleId = req.params.id;//sacando id de la url
            Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {

                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen de artículo'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }
    }, // end upload file

    getImage: (req, res) => {

        //var file = req.params.image;
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.stat(path_file, (err, exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'No exste la imagen'
                });
            }
        });

    },

    search: (req, res) => {
        //Sacar el string a buscar
        var searchString = req.params.search;

        //Find or
        //Permite buscar pa
        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "description": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {

                if (err) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error en la petición.'
                    });
                }

                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay artículos que coincidan con tu búsqueda'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articles
                });
            })

    }

}; // end controller

module.exports = controller;
