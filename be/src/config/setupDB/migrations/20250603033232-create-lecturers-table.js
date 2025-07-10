'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lecturers', {
      // *** THÊM KHÓA NGOẠI user_id ***
      account_id: {
        type: Sequelize.UUID, // Phải khớp kiểu dữ liệu với id của bảng 'accounts'
        allowNull: false,
        unique: true, // Đảm bảo mỗi user_id chỉ xuất hiện 1 lần trong bảng lecturers
        references: {
          model: 'accounts', // Tên bảng đích (Common User Table)
          key: 'id' // Tên cột khóa chính của bảng đích
        },
        onUpdate: 'CASCADE', // Nếu id trong accounts thay đổi, id ở đây cũng thay đổi
        onDelete: 'CASCADE'  // Nếu account bị xóa, bản ghi lecturer tương ứng cũng bị xóa
      },
      // *** CÁC TRƯỜNG CÒN LẠI CỦA BẢNG LECTURERS ***
      lecturer_id: { // Giữ nguyên lecturer_id nếu nó có ý nghĩa nghiệp vụ riêng (ví dụ: mã giảng viên)
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
      },
      name: { // fullName từ Google profile hoặc được nhập
        type: Sequelize.STRING(50),
        allowNull: true
      },
      // *** BỎ email ở đây vì nó đã có trong bảng accounts ***
      // email: {
      //   type: Sequelize.STRING(70),
      //   allowNull: true,
      //   // unique: true // Bỏ dòng này
      // },
      day_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      department: { // Trường đặc thù cho giảng viên
        type: Sequelize.STRING(100),
        allowNull: true
      },
      hire_date: { // Trường đặc thù cho giảng viên
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      degree: { // Trường đặc thù cho giảng viên (ví dụ: Thạc sĩ, Tiến sĩ)
        type: Sequelize.STRING(100),
        allowNull: true
      },
      // academic_rank: { // Ví dụ: Học hàm, học vị (GS, PGS) - bổ sung nếu cần
      //    type: Sequelize.STRING(50),
      //    allowNull: true
      // },
      // *** BỎ google_id ở đây vì nó đã có trong bảng accounts ***
      // google_id: {
      //   type: Sequelize.STRING(100),
      //   allowNull: true,
      //   unique: true
      // },
      status: { // Trạng thái của bản ghi giảng viên này
        type: Sequelize.STRING(30),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lecturers');
  }
};