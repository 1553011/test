'use strict';
module.exports = (sequelize, DataTypes) => {
  var CustomShirt = sequelize.define('CustomShirt', {
    name: DataTypes.TEXT,
    image: DataTypes.TEXT,
    vnprice: DataTypes.TEXT,
    usprice: DataTypes.TEXT,
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    tax: DataTypes.TEXT,
    sku: DataTypes.TEXT,
    currency: DataTypes.TEXT
  }, {});
  CustomShirt.associate = function(models) {
    // associations can be defined here
    CustomShirt.belongsTo(models.Bill);
  };
  return CustomShirt;
};