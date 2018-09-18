var controller ={};
var models = require('../models');
var bcrypt = require('bcryptjs');
var Sequelize = require('sequelize');
controller.createUser=function(user,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(user.password,salt,function(err,hash){
            user.password = hash;
            models.User
            .create(user)
            .then(function(){
                callback(err);
            });
        });
    });
};
controller.getUserByEmail = function(email,callback){
    var Obj={email:email};
    models.User.findOne(
        {where: Obj}
    )
    .then(function(user){
        callback(false,user);
    })
    .catch(function(err)
    {
        callback(err,null);   
    });
};

controller.getByEmail = function (email, callback) {
    models.User
        .findOne({
            where: {
                email: email
            },
        
        })
        .then(function (user) {
            callback(user);
        });
};

controller.comparePassword = function(password, hash, callback){
    console.log("password:"+password);
    console.log("hash:"+hash);
    bcrypt.compare(password,hash,function(err,isMatch){
        if(err) throw err;
        callback(null,isMatch);
    });
};
controller.getUserById=function(id,callback){
    models.User.findById(id)
    .then(function(user){
        callback(false,user);
    });
}

controller.getAll = function (callback) {
    models.User
        .findAll()
        .then(function (users) {
            callback(users);
        })
};

controller.getAllBill = function ( callback) {
    models.User
        .findAll({
            
            include: [{
                model:models.Bill,
                as: "Bills",           
                include: [{
                  model: models.CustomShirt,         
                  as: 'CustomShirts',
                }]
            }]
        })
        .then(function (users) {
            callback(users);
        });
};

controller.count = function ( callback) {
    models.User
        .count()
        .then(function (c) {
            callback(c);
        });
};
controller.getById = function (id, callback) {
    models.User
        .findOne({
            where: {
                id: id
            },
            include: [{
                model:models.Bill,
                as: "Bills",           
                include: [{
                  model: models.CustomShirt,         
                  as: 'CustomShirts',
                }]
            }]
        })
        .then(function (user) {
            callback(user);
        });
};

controller.updateById = function (id,name,phone,address, callback) {
    console.log("userId:"+id);
    console.log("name:"+name);
    console.log("address:"+address);
    console.log("phone:"+phone);
    models.User.update({
            phone:phone,
            name:name,
            address:address
        }, {
        where: {
            id: id
        },
        include: [{
            model:models.Bill,
            as: "Bills",           
            include: [{
              model: models.CustomShirt,         
              as: 'CustomShirts',
            }]
        }]
    }).then(function (bill) {
        callback(bill);
    });
    
};

controller.changePasswordById = function (id,newPassword, callback) {
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newPassword,salt,function(err,hash){
            models.User.update({
                    password:hash
                }, {
                where: {
                    id: id
                }, include: [{
                    model:models.Bill,
                    as: "Bills",           
                    include: [{
                        model: models.CustomShirt,         
                        as: 'CustomShirts',
                    }]
                }]
            }).then(function (bill) {
                callback(bill);
            });
        });
    });
};


controller.update = function (id, isEnable, callback) {
    models.User.update({
        isEnable:isEnable
    }, {
        where: {
            id: id
        }
    }).then(function (users) {
        callback(users);
    });
};
controller.deleteCustomShirtById = function (id, callback) {
    models.CustomShirt
        .destroy({
            where: {
                id:id
            }
        }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
                console.log('Deleted successfully');
                models.User
                .findOne({
                    where: {
                        id: rowDeleted.UserId
                    },
                    include: [models.CustomShirt]
                    
                })
                .then(function (user) {
                    callback(user);
                });
            }
        }, function(err){
            console.log(err); 
        });
};

controller.findAllArr = function (arr,callback) {
    models.User
        .findAll({
            where:{
                email:{
                    [Sequelize.Op.like]:arr
                }
            }
        })
        .then(function (users) {
            callback(users);
        })
};
module.exports=controller;