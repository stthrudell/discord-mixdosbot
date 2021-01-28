'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.createTable('users', 
        { 
          discordId: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          steamId: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DATE ,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE ,
            allowNull: false,
          }
        }
      );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
