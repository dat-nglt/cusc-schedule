import { v4 as uuidv4 } from "uuid";

export default {
  /**
   * Runs the seeding for the 'up' migration.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // --- Seed data for 10 lecturers ---
      const lecturersData = [
        {
          id: "GV001",
          name: "Trần Thị B",
          email: "lecturer1@example.com",
          department: "Khoa Công nghệ thông tin",
          degree: "Tiến sĩ",
          academic_rank: "Phó Giáo sư",
        },
        {
          id: "GV002",
          name: "Nguyễn Văn A",
          email: "lecturer2@example.com",
          department: "Khoa Công nghệ thông tin",
          degree: "Thạc sĩ",
          academic_rank: "Giảng viên chính",
        },
        {
          id: "GV003",
          name: "Lê Thị C",
          email: "lecturer3@example.com",
          department: "Khoa Khoa học tự nhiên",
          degree: "Tiến sĩ",
          academic_rank: "Giảng viên cao cấp",
        },
        {
          id: "GV004",
          name: "Phạm Minh D",
          email: "lecturer4@example.com",
          department: "Khoa Ngoại ngữ",
          degree: "Thạc sĩ",
          academic_rank: "Giảng viên",
        },
        {
          id: "GV005",
          name: "Hoàng Văn E",
          email: "lecturer5@example.com",
          department: "Khoa Kinh tế",
          degree: "Tiến sĩ",
          academic_rank: "Phó Giáo sư",
        },
        {
          id: "GV006",
          name: "Đặng Thu F",
          email: "lecturer6@example.com",
          department: "Khoa Kinh tế",
          degree: "Thạc sĩ",
          academic_rank: "Giảng viên",
        },
        {
          id: "GV007",
          name: "Võ Thị G",
          email: "lecturer7@example.com",
          department: "Khoa Khoa học xã hội",
          degree: "Tiến sĩ",
          academic_rank: "Giảng viên chính",
        },
        {
          id: "GV008",
          name: "Đỗ Bá H",
          email: "lecturer8@example.com",
          department: "Khoa Khoa học xã hội",
          degree: "Thạc sĩ",
          academic_rank: "Giảng viên",
        },
        {
          id: "GV009",
          name: "Bùi Đình I",
          email: "lecturer9@example.com",
          department: "Khoa Công nghệ thông tin",
          degree: "Thạc sĩ",
          academic_rank: "Giảng viên",
        },
        {
          id: "GV010",
          name: "Trương Thị K",
          email: "lecturer10@example.com",
          department: "Khoa Công nghệ thông tin",
          degree: "Tiến sĩ",
          academic_rank: "Giảng viên chính",
        },
      ];

      const lecturerAccounts = lecturersData.map((lecturer) => ({
        id: uuidv4(),
        email: lecturer.email,
        role: "lecturer",
        google_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      await queryInterface.bulkInsert("accounts", lecturerAccounts, {
        transaction,
      });

      const lecturerDetails = lecturersData.map((lecturer, index) => ({
        account_id: lecturerAccounts[index].id,
        lecturer_id: lecturer.id,
        name: `${lecturer.name} (Giảng viên)`,
        department: lecturer.department,
        hire_date: "2010-09-01",
        degree: lecturer.degree,
        academic_rank: lecturer.academic_rank,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      await queryInterface.bulkInsert("lecturers", lecturerDetails, {
        transaction,
      });

      // --- Remaining seed data as before ---

      // --- 1. Create Account and detailed data for Admin ---
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
        {
          transaction,
        }
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
        {
          transaction,
        }
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
        {
          transaction,
        }
      );
      await queryInterface.bulkInsert(
        "students",
        [
          {
            account_id: studentAccountId,
            student_id: "SV001",
            name: "Lê Văn C (Sinh viên)",
            class_id: null,
            admission_year: "2023-09-01",
            gpa: 3.5,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {
          transaction,
        }
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
        {
          transaction,
        }
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
            status: "active",
          },
        ],
        {
          transaction,
        }
      );

      // --- 5. Create Sample Courses ---
      await queryInterface.bulkInsert(
        "courses",
        [
          {
            course_id: "K2023",
            course_name: "Khóa 2023-2027",
            start_date: "2023-09-01",
            end_date: "2027-08-31",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            course_id: "K2022",
            course_name: "Khóa 2022-2026",
            start_date: "2022-09-01",
            end_date: "2026-08-31",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {
          transaction,
        }
      );

      // --- 6. Create Sample Classes (referencing courses) ---
      await queryInterface.bulkInsert(
        "classes",
        [
          {
            class_id: "DH23CS",
            class_name: "Đại học 23 Công nghệ Phần mềm",
            class_size: 60,
            status: "active",
            course_id: "K2023",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            class_id: "DH22IT",
            class_name: "Đại học 22 Công nghệ thông tin",
            class_size: 70,
            status: "active",
            course_id: "K2022",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            class_id: "DH23AI",
            class_name: "Đại học 23 Trí tuệ nhân tạo",
            class_size: 55,
            status: "active",
            course_id: "K2023",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {
          transaction,
        }
      );

      // Update student's class_id if needed, now that classes exist
      await queryInterface.bulkUpdate(
        "students",
        {
          class_id: "DH23CS",
        },
        {
          student_id: "SV001",
        },
        {
          transaction,
        }
      );

      // --- 7. Create Sample Break Schedules ---
      await queryInterface.bulkInsert(
        "break_schedule",
        [
          {
            break_id: "TT001",
            break_start_date: "2025-01-20",
            break_end_date: "2025-02-10",
            number_of_days: 22,
            break_type: "Nghỉ Tết Nguyên Đán",
            description: "Nghỉ Tết Giáp Thìn",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            break_id: "NL001",
            break_start_date: "2024-04-30",
            break_end_date: "2024-05-01",
            number_of_days: 2,
            break_type: "Nghỉ lễ",
            description: "Nghỉ lễ 30/4 và 1/5",
            status: "completed",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {
          transaction,
        }
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
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("break_schedule", null, { transaction });
      await queryInterface.bulkDelete("students", null, { transaction });
      await queryInterface.bulkDelete("classes", null, { transaction });
      await queryInterface.bulkDelete("courses", null, { transaction });
      await queryInterface.bulkDelete("admins", null, { transaction });
      await queryInterface.bulkDelete("lecturers", null, { transaction });
      await queryInterface.bulkDelete("training_officers", null, {
        transaction,
      });
      await queryInterface.bulkDelete("accounts", null, { transaction });
      await transaction.commit();
      console.log("Seeders have been successfully reverted!");
    } catch (error) {
      await transaction.rollback();
      console.error("Error reverting seeders:", error);
      throw error;
    }
  },
};
