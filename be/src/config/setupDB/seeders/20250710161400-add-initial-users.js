"use strict";

const { v4: uuidv4 } = require("uuid"); // Để tạo UUID cho Account ID

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // --- 1. Tạo Account và dữ liệu chi tiết cho Admin ---
      const adminAccountId = uuidv4();
      await queryInterface.bulkInsert(
        "accounts",
        [
          {
            id: adminAccountId,
            email: "ptvu2100761@student.ctuet.edu.vn",
            role: "admin",
            google_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      await queryInterface.bulkInsert(
        "admins",
        [
          {
            account_id: adminAccountId, // Sử dụng account_id để khớp với định nghĩa model
            admin_id: "AD001",
            name: "Nguyễn Văn A (Admin)",
            // Thêm các trường đặc thù của Admin nếu có, ví dụ:
            admin_type: "Super Admin",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );

      // --- 2. Tạo Account và dữ liệu chi tiết cho Lecturer ---
      const lecturerAccountId = uuidv4();
      await queryInterface.bulkInsert(
        "accounts",
        [
          {
            id: lecturerAccountId,
            email: "lecturer@example.com",
            role: "lecturer",
            google_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      await queryInterface.bulkInsert(
        "lecturers",
        [
          {
            account_id: lecturerAccountId, // Sử dụng account_id để khớp với định nghĩa model
            lecturer_id: "GV001",
            name: "Trần Thị B (Giảng viên)",
            department: "Khoa Công nghệ thông tin",
            hire_date: "2010-09-01",
            degree: "Tiến sĩ",
            academic_rank: "Phó Giáo sư", // Ví dụ thêm trường đã đề xuất
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );

      // --- 3. Tạo Account và dữ liệu chi tiết cho Student ---
      const studentAccountId = uuidv4();
      await queryInterface.bulkInsert(
        "accounts",
        [
          {
            id: studentAccountId,
            email: "student@example.com",
            role: "student",
            google_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      await queryInterface.bulkInsert(
        "students",
        [
          {
            account_id: studentAccountId, // Sử dụng account_id để khớp với định nghĩa model
            student_id: "SV001",
            name: "Lê Văn C (Sinh viên)",
            class_id: "L001", // Giả sử có lớp L001
            admission_year: "2023-09-01",
            gpa: 3.5,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );

      // --- 4. Tạo Account và dữ liệu chi tiết cho Training Officer ---
      const trainingOfficerAccountId = uuidv4();
      await queryInterface.bulkInsert(
        "accounts",
        [
          {
            id: trainingOfficerAccountId,
            email: "dhchuong@student.ctuet.edu.vn",
            role: "training_officer",
            google_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      await queryInterface.bulkInsert(
        "training_officers", // Đảm bảo tên bảng là 'training_officers'
        [
          {
            account_id: trainingOfficerAccountId, // Sử dụng account_id để khớp với định nghĩa model
            staff_id: "CB001",
            name: "Phạm Thị D (Cán bộ ĐT)",
            department: "Phòng Đào tạo",
            position: "Trưởng phòng",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );

      // --- 5. Thêm một email test vào db: nguyenletandat.contact@gmail.com (chỉ Account) ---
      const testUserAccountId = uuidv4();
      await queryInterface.bulkInsert(
        "accounts",
        [
          {
            id: testUserAccountId,
            email: "nguyenletandat.contact@gmail.com",
            role: "admin", // Vai trò mặc định cho tài khoản này
            google_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );

      // Nếu bạn muốn tạo bản ghi chi tiết cho 'nguyenletandat.contact@gmail.com', bạn sẽ làm như sau:
      // (Bỏ comment nếu cần, và đảm bảo student_id là duy nhất)
      // await queryInterface.bulkInsert('students', [{
      //   account_id: testUserAccountId,
      //   student_id: 'SV002', // ID sinh viên duy nhất
      //   name: 'Nguyễn Lê Tấn Đạt',
      //   class_id: 'L001',
      //   admission_year: '2023-09-01',
      //   gpa: 3.8,
      //   created_at: new Date(),
      //   updated_at: new Date()
      // }], { transaction });

      await transaction.commit();
      console.log("Seeders đã được thêm thành công!");
    } catch (error) {
      await transaction.rollback();
      console.error("Lỗi khi chạy seeders:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Đảm bảo xóa các bản ghi chi tiết trước, sau đó mới xóa bản ghi Accounts
      await queryInterface.bulkDelete("admins", null, { transaction });
      await queryInterface.bulkDelete("lecturers", null, { transaction });
      await queryInterface.bulkDelete("students", null, { transaction });
      await queryInterface.bulkDelete("training_officers", null, {
        transaction,
      }); // Xóa training_officers

      // Cuối cùng xóa các bản ghi Account
      await queryInterface.bulkDelete("accounts", null, { transaction });

      await transaction.commit();
      console.log("Seeders đã được xóa thành công!");
    } catch (error) {
      await transaction.rollback();
      console.error("Lỗi khi hoàn tác seeders:", error);
      throw error;
    }
  },
};
