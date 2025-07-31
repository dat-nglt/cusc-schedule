import { v4 as uuidv4 } from "uuid";

export default {
  /**
   * Runs the seeding for the 'up' migration.
   * Inserts initial data into 'accounts', 'admins', 'lecturers', 'students', and 'training_officers' tables.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    // Start a transaction to ensure all inserts are atomic
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // --- 1. Create Account and detailed data for Admin ---
      const adminAccountId = uuidv4();
      await queryInterface.bulkInsert(
        "accounts",
        [
          {
            id: adminAccountId,
            email: "nguyenletandat.contact@gmail.com",
            role: "admin",
            google_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction } // Ensure this insert is part of the transaction
      );
      await queryInterface.bulkInsert(
        "admins",
        [
          {
            account_id: adminAccountId,
            admin_id: "AD001",
            name: "Nguyễn Lê Tấn Đạt",
            admin_type: "Super Admin",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction } // Ensure this insert is part of the transaction
      );

      // --- 2. Create Account and detailed data for Lecturer ---
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
            account_id: lecturerAccountId,
            lecturer_id: "GV001",
            name: "Trần Thị B (Giảng viên)",
            department: "Khoa Công nghệ thông tin",
            hire_date: "2010-09-01",
            degree: "Tiến sĩ",
            academic_rank: "Phó Giáo sư",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );

      // --- 3. Create Account and detailed data for Student ---
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
            account_id: studentAccountId,
            student_id: "SV001",
            name: "Lê Văn C (Sinh viên)",
            class_id: null, // Ensure this column is nullable in your 'students' table definition
            admission_year: "2023-09-01",
            gpa: 3.5,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );

      // --- 4. Create Account and detailed data for Training Officer ---
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
        "training_officers",
        [
          {
            account_id: trainingOfficerAccountId,
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

      // Commit the transaction if all operations succeed
      await transaction.commit();
      console.log("Seeders have been successfully added!");
    } catch (error) {
      // Rollback the transaction if any operation fails
      await transaction.rollback();
      console.error("Error running seeders:", error);
      throw error; // Re-throw the error to indicate failure
    }
  },

  /**
   * Reverts the seeding for the 'down' migration.
   * Deletes the seeded data from 'admins', 'lecturers', 'students', 'training_officers', and 'accounts' tables.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Ensure to delete detailed records first due to foreign key constraints,
      // then delete the Account records.
      await queryInterface.bulkDelete("admins", null, { transaction });
      await queryInterface.bulkDelete("lecturers", null, { transaction });
      await queryInterface.bulkDelete("students", null, { transaction });
      await queryInterface.bulkDelete("training_officers", null, {
        transaction,
      });

      // Finally, delete the Account records
      await queryInterface.bulkDelete("accounts", null, { transaction });

      await transaction.commit();
      console.log("Seeders have been successfully reverted!");
    } catch (error) {
      await transaction.rollback();
      console.error("Error reverting seeders:", error);
      throw error; // Re-throw the error to indicate failure
    }
  },
};
