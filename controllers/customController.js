var controller = {};

var models = require('../models');

controller.create = function (billId,userId,name, image,price, callback) {
    var us=(price/22000).toFixed(2).replace(/./g, function(c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
    models.CustomShirt
        .create({
            name: name,
            image: image,
            vnprice: price,
            usprice: us,
            createdAt: new Date(),
            updatedAt: new Date(),
            UserId: userId,
            BillId: billId,
            description: 'shirt',
            quantity: 1,
            tax: '0.00',
            sku: 'shirt',
            currency: 'USD'
        }).then(function (customShirts) {
            callback(customShirts);
        });
    
};

controller.destroy = function (id, callback) {
    models.CustomShirt.destroy({
        where: {
            id: id
        }
    }).then(function (customShirts) {
        callback(customShirts);
    });
};





module.exports = controller;