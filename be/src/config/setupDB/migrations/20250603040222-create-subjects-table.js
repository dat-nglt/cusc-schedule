'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subjects', {
      subject_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      subject_name: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      credit: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      theory_hours: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      practice_hours: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      deleted_at: {             // 👈 thêm cột deleted_at cho soft delete
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('subjects');
  }
};
