var controller = {};

var models = require('../models');
var sequelize = require('sequelize');
controller.create = function (userId,name,price, firstname,
	lastname,
	countrycode,
	postalcode,
	state,
	phone,
	city,
	address,
	method, callback) {
    models.Bill
        .create({
            name: name,
            price: price,
            createdAt: new Date(),
            updatedAt: new Date(),
            isPaid:false,
            isDelete:false,
            UserId: userId,
            firstname:firstname,
            lastname:lastname,
            countrycode:countrycode,
            postalcode:postalcode,
            state:state,
            phone:phone,
            city:city,
            address:address,
            method:method
        }).then(function (customShirts) {
            callback(customShirts);
        });
    
};

controller.count = function ( callback) {
    models.Bill
        .count({
            where:{
                isDelete:false,
            }
        })
        .then(function (c) {
            callback(c);
        });
};


controller.getAll = function ( callback) {
    models.Bill
        .findAll({
            where:{
                isDelete:false,
            },
            order:[['createdAt','DESC']],
        })
        .then(function (users) {
            callback(users);
        });
};

controller.sum = function ( callback) {
    models.Bill
        .sum('price',
        {
            where:{
                isDelete:false,
            }
        })
        .then(function (c) {
            callback(c);
        });
};
controller.setPaidById = function (billId,isPaid, callback) {
    models.Bill.update({
        isPaid:isPaid,
    }, {
        where: {
            id: billId
        }
    }).then(function (bill) {
        callback(bill);
    });
    
};

controller.getById = function (id, callback) {
    models.Bill.findOne({
        where: {
            id: id
        },
        include :[models.CustomShirt]
    }).then(function (bill) {
        callback(bill);
    });
    
};

controller.destroy = function (id, callback) {
    models.Bill.destroy({
        where: {
            id: id
        }
    }).then(function (customShirts) {
        callback(customShirts);
    });
};

controller.delete = function (id,isDelete,callback) {
    models.Bill.update({
        isDelete:isDelete}, {
        where: {
            id: id
        }
    }).then(function (customShirts) {
        callback(customShirts);
    });
};

controller.getSumbyDate = function (callback) {
    models.Bill.findAll({
        
        attributes: [[sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')),'date'],[sequelize.fn('sum',sequelize.col('price')),'total']],
        where:{
            isDelete:false,
        },
        group: [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')),'date'],
        //order:[['date',"DESC"]],
        raw:true
    }).then(function (customShirts) {
        callback(customShirts);
    });
};




module.exports = controller;