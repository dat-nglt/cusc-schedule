"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("training_officers", {
      // *** THÊM KHÓA NGOẠI user_id ***
      account_id: {
        type: Sequelize.UUID, // Phải khớp kiểu dữ liệu với id của bảng 'accounts'
        allowNull: false,
        unique: true, // Đảm bảo mỗi user_id chỉ xuất hiện 1 lần trong bảng training_officers
        references: {
          model: "accounts", // Tên bảng đích (Common User Table)
          key: "id", // Tên cột khóa chính của bảng đích
        },
        onUpdate: "CASCADE", // Nếu id trong accounts thay đổi, id ở đây cũng thay đổi
        onDelete: "CASCADE", // Nếu account bị xóa, bản ghi training_officer tương ứng cũng bị xóa
      },
      // *** CÁC TRƯỜNG CÒN LẠI CỦA BẢNG TRAINING_OFFICERS ***
      staff_id: {
        // Giữ nguyên staff_id nếu nó có ý nghĩa nghiệp vụ riêng (ví dụ: mã cán bộ)
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        // fullName từ Google profile hoặc được nhập
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      // *** BỎ email ở đây vì nó đã có trong bảng accounts ***
      // email: {
      //   type: Sequelize.STRING(70),
      //   allowNull: true,
      //   // unique: true // Bỏ dòng này
      // },
      day_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      department: {
        // Trường đặc thù cho cán bộ đào tạo
        type: Sequelize.STRING(100), // Tăng độ dài nếu cần
        allowNull: true,
      },
      position: {
        // Trường đặc thù cho cán bộ đào tạo
        type: Sequelize.STRING(50), // Tăng độ dài nếu cần
        allowNull: true,
      },
      // *** BỎ google_id ở đây vì nó đã có trong bảng accounts ***
      // google_id: {
      //   type: Sequelize.STRING(100),
      //   allowNull: true,
      //   unique: true
      // },
      status: {
        // Trạng thái của bản ghi cán bộ đào tạo này
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("training_officers");
  },
};
