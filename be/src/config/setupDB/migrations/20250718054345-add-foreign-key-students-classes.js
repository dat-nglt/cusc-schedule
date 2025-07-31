'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    // Thêm ràng buộc khóa ngoại cho cột class_id đã có sẵn
    await queryInterface.addConstraint('students', {
      fields: ['class_id'],
      type: 'foreign key',
      name: 'fk_students_class_id',
      references: {
        table: 'classes',
        field: 'class_id' // Tên cột khóa chính trong bảng 'classes'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Thêm index cho hiệu suất truy vấn
    await queryInterface.addIndex('students', ['class_id']);
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa index trước
    await queryInterface.removeIndex('students', ['class_id']);
    
    // Xóa ràng buộc khóa ngoại
    await queryInterface.removeConstraint('students', 'fk_students_class_id');
  }
};