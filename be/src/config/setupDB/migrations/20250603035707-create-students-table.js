"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("students", {
      // *** KHÓA NGOẠI user_id liên kết với bảng 'accounts' ***
      // Đảm bảo tên cột khớp với tên trong model và seeder!
      account_id: {
        type: Sequelize.UUID, // Phải khớp kiểu dữ liệu với id của bảng 'accounts'
        allowNull: false,
        unique: true, // Đảm bảo mỗi tài khoản chỉ có một bản ghi student
        references: {
          model: "accounts", // Tên bảng đích
          key: "id", // Tên cột khóa chính của bảng đích
        },
        onUpdate: "CASCADE", // Cập nhật cascaded
        onDelete: "CASCADE", // Xóa cascaded (xóa account sẽ xóa student)
      },

      // *** student_id: Khóa chính riêng của bảng students ***
      // Giữ lại làm primary key vì nó là mã số nghiệp vụ của sinh viên
      student_id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },

      // *** Tên của sinh viên ***
      name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      // *** Ngày sinh của sinh viên ***
      day_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      // *** Giới tính của sinh viên ***
      gender: {
        type: Sequelize.STRING(20), // Có thể là 'Nam', 'Nữ', 'Khác'
        allowNull: true,
      },
      // *** Địa chỉ của sinh viên ***
      address: {
        type: Sequelize.STRING(255), // Hoặc kiểu dữ liệu phù hợp với địa chỉ
        allowNull: true,
      },
      // *** Số điện thoại của sinh viên ***
      phone_number: {
        type: Sequelize.STRING(20), // Hoặc kiểu dữ liệu phù hợp với số điện thoại
        allowNull: true,
      },
      // *** class_id: Khóa ngoại liên kết với bảng 'classes' ***
      // Đảm bảo tên cột khớp với tên trong model và seeder!
      class_id: {
        type: Sequelize.STRING(100), // Hoặc kiểu dữ liệu của ID trong bảng 'classes'
        allowNull: true, // Có thể là sinh viên chưa có lớp ngay lập tức
        // Nếu bạn đã có bảng 'classes' và muốn thêm ràng buộc khóa ngoại cứng ở cấp độ migration,
        // bạn có thể uncomment phần references dưới đây.
        // references: {
        //   model: 'classes', // Tên bảng lớp học của bạn
        //   key: 'id' // Hoặc 'class_id' nếu đó là khóa chính của bảng lớp học
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL', // Nếu lớp học bị xóa, class_id của sinh viên đặt về NULL
      },

      // *** Các trường đặc thù của sinh viên ***
      admission_year: {
        type: Sequelize.DATEONLY, // Hoặc DataTypes.INTEGER nếu chỉ lưu năm
        allowNull: true,
      },
      gpa: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
      },
      // *** Trạng thái của sinh viên (đang học, tốt nghiệp) *** 
      status: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      // *** CÁC TRƯỜNG TIMESTAMP ***
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

      // *** CÁC TRƯỜNG ĐÃ BỊ LOẠI BỎ/CHUYỂN SANG BẢNG ACCOUNTS: ***
      // email: đã được quản lý trong bảng accounts
      // day_of_birth: đã được quản lý trong bảng accounts (hoặc có thể thêm vào bảng Profile chung)
      // gender: đã được quản lý trong bảng accounts (hoặc có thể thêm vào bảng Profile chung)
      // address: đã được quản lý trong bảng accounts (hoặc có thể thêm vào bảng Profile chung)
      // phone_number: đã được quản lý trong bảng accounts (hoặc có thể thêm vào bảng Profile chung)
      // status: đã được quản lý trong bảng accounts
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("students");
  },
};
