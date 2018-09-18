'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  return queryInterface.bulkInsert('Shirts', [{
    name: 'Áo thun nam',
    image: '/image/shirt-1.jpeg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-2.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-3.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-4.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-5.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-6.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-1.jpeg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-2.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-3.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-4.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-5.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
  },
  {
    name: 'Áo thun nam',
    image: '/image/shirt-6.jpg',
    price: '200000', 
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()')
	}], {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('Shirt', null, {});
  }
};
