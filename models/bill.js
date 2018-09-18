'use strict';
module.exports = (sequelize, DataTypes) => {
  var Bill = sequelize.define('Bill', {
    name: DataTypes.TEXT,
    isPaid: DataTypes.BOOLEAN,
    isDelete: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    method:DataTypes.STRING,
    firstname:DataTypes.STRING,
    lastname:DataTypes.STRING,
    countrycode:DataTypes.STRING,
    postalcode:DataTypes.STRING,
    state:DataTypes.STRING,
    phone:DataTypes.STRING,
    city:DataTypes.STRING,
    address:DataTypes.STRING   
  }, {});
  Bill.associate = function(models) {
    // associations can be defined here
    Bill.belongsTo(models.User);
    // associations can be defined here
    Bill.hasMany(models.CustomShirt);
  };
  
  return Bill;
};