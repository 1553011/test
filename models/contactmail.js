'use strict';
module.exports = (sequelize, DataTypes) => {
  var ContactMail = sequelize.define('ContactMail', {
    email: DataTypes.TEXT
  }, {});


  ContactMail.associate = function(models) {
    // associations can be defined here
  };
  return ContactMail;
};