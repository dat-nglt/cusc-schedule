'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Thêm cột deleted_at vào tất cả các bảng
    const tables = [
      'admins',
      'break_schedule',
      'classes',
      'courses',
      'lecturers',
      'programs',
      'semesters',
      'students',
      'subjects',
      'training_officers'
    ];

    for (const table of tables) {
      await queryInterface.addColumn(table, 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // Xóa cột deleted_at khỏi tất cả các bảng
    const tables = [
      'admins',
      'break_schedule',
      'classes',
      'courses',
      'lecturers',
      'programs',
      'semesters',
      'students',
      'subjects',
      'training_officers'
    ];

    for (const table of tables) {
      await queryInterface.removeColumn(table, 'deleted_at');
    }
  }
};
