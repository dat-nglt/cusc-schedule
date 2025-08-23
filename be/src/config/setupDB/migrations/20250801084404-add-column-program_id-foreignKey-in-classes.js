'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('classes', 'program_id', {
      type: Sequelize.STRING(30),
      allowNull: true,
      references: {
        model: 'programs',
        key: 'program_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('classes', 'program_id');
  }
};
