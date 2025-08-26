'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      class_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      class_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      class_size: {
        type: Sequelize.SMALLINT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      course_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'courses',
          key: 'course_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deleted_at: {                 // 👈 thêm cột để hỗ trợ soft delete
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('classes');
  },
};
