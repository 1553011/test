var controller = {};

var models = require('../models');

var Sequelize = require('sequelize');


controller.create = function (email, callback) {
    models.ContactMail
        .create({
            email:email,
            createdAt: new Date(),
            updatedAt: new Date()
            
        }).then(function (contactMails) {
            callback(contactMails);
        });
    
};
controller.getAll = function (callback) {
    models.ContactMail
        .findAll()
        .then(function (contactMails) {
            callback(contactMails);
        })
};

controller.findAllArr = function (arr,callback) {
    models.ContactMail
        .findAll({
            where:{
                email:{
                    [Sequelize.Op.like]:arr
                }
            }
        })
        .then(function (contactMails) {
            callback(contactMails);
        })
};

controller.count = function ( callback) {
    models.ContactMail
        .count()
        .then(function (c) {
            callback(c);
        });
};


module.exports = controller;