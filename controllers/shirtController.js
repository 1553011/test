var controller = {};

var models = require('../models');
var Sequelize = require('sequelize');
controller.getAll = function (callback) {
    models.Shirt
        .findAll({
            order: [['name', 'ASC']]
        })
        .then(function (shirts) {
            callback(shirts);
        })
};
controller.getById = function (id, callback) {
    models.Shirt
        .findOne({
            where: {
                id: id
            },
        
        })
        .then(function (shirt) {
            callback(shirt);
        });
};

controller.create = function (name, image,price, callback) {
    models.Shirt
        .create({
            name: name,
            image: image,
            price: price,
            createdAt: new Date(),
            updatedAt: new Date()
        }).then(function (shirts) {
            callback(shirts);
        });
    
};


controller.destroy = function (id, callback) {
    models.Shirt.destroy({
        where: {
            id: id
        }
    }).then(function (shirts) {
        callback(shirts);
    });
};

controller.update = function (id, price, name, callback) {
    models.Shirt.update({
        price: price,
        name: name
    }, {
        where: {
            id: id
        }
    }).then(function (shirts) {
        callback(shirts);
    });
};

controller.findAllArr = function (arr,callback) {
    models.Shirt
        .findAll({
            where:{
                name:{
                    [Sequelize.Op.like]:arr
                }
            }
        })
        .then(function (shirts) {
            callback(shirts);
        })
};

controller.count = function ( callback) {
    models.Shirt
        .count()
        .then(function (c) {
            callback(c);
        });
};


module.exports = controller;