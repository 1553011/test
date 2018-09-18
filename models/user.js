'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    isAdmin: DataTypes.BOOLEAN,
    isEnable: DataTypes.BOOLEAN,
    name: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    address: DataTypes.TEXT
  }, {});

  
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Bill);
  };
  return User;
};