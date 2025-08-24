"use strict";

import { v4 as uuidv4 } from "uuid";

export default {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      console.log("🚀 Bắt đầu chạy seeders...");

      const users = {
        admin: [
          {
            name: "Nguyễn Lê Tấn Đạt",
            email: "ptvu2100761@student.ctuet.edu.vn",
            type: "Super Admin",
          },
        ],
        training_officer: [
          {
            name: "Phạm Thị D (Cán bộ ĐT)",
            email: "dhchuong@student.ctuet.edu.vn",
            department: "Phòng Đào tạo",
            position: "Trưởng phòng",
          },
        ],
        lecturer: [
          {
            id: "GV001",
            name: "Trần Thị B",
            email: "tuanvukg601@gmail.com",
            department: "Khoa Công nghệ thông tin",
            degree: "Tiến sĩ",
            academic_rank: "Phó Giáo sư",
            phone_number: "0901234567",
            gender: "Nữ",
            address: "Cần Thơ",
            day_of_birth: "1980-05-15",
          },
          {
            id: "GV002",
            name: "Nguyễn Văn A",
            email: "lecturer2@example.com",
            department: "Khoa Công nghệ thông tin",
            degree: "Thạc sĩ",
            academic_rank: "Giảng viên chính",
            phone_number: "0901234568",
            gender: "Nam",
            address: "Hồ Chí Minh",
            day_of_birth: "1982-11-20",
          },
        ],
        student: [
          {
            student_id: "SV001",
            name: "Lê Văn C (Sinh viên)",
            email: "nhox.kenny.vans@gmail.com",
            admission_year: "2023-09-01",
            gpa: 3.5,
            class_id: "DH23CS",
          },
        ],
      };

      const createUsers = async (role, userData, tableName) => {
        console.log(`👉 Đang tạo accounts cho role: ${role}...`);
        const accounts = userData.map((user) => ({
          id: uuidv4(),
          email: user.email,
          role,
          google_id: null,
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        }));
        await queryInterface.bulkInsert("accounts", accounts, { transaction });
        console.log(
          `✅ Đã insert ${accounts.length} accounts cho role: ${role}`
        );

        const details = userData.map((user, index) => {
          const baseDetails = {
            account_id: accounts[index].id,
            created_at: new Date(),
            updated_at: new Date(),
          };
          switch (role) {
            case "admin":
              return {
                ...baseDetails,
                admin_id: "AD001",
                name: user.name,
                admin_type: user.type,
              };
            case "lecturer":
              return {
                ...baseDetails,
                lecturer_id: user.id,
                name: user.name,
                department: user.department,
                degree: user.degree,
                academic_rank: user.academic_rank,
                phone_number: user.phone_number,
                gender: user.gender,
                address: user.address,
                day_of_birth: user.day_of_birth,
                status: "active",
              };
            case "training_officer":
              return {
                ...baseDetails,
                staff_id: "CB001",
                name: user.name,
                department: user.department,
                position: user.position,
                status: "active",
              };
            case "student":
              return {
                ...baseDetails,
                student_id: user.student_id,
                name: user.name,
                class_id: user.class_id,
                admission_year: user.admission_year,
                gpa: user.gpa,
              };
            default:
              return baseDetails;
          }
        });
        await queryInterface.bulkInsert(tableName, details, { transaction });
        console.log(
          `✅ Đã insert ${details.length} bản ghi vào bảng ${tableName}`
        );
      };

      // 1. Seed các bảng không có khóa ngoại
      await createUsers("admin", users.admin, "admins");
      await createUsers(
        "training_officer",
        users.training_officer,
        "training_officers"
      );
      await createUsers("lecturer", users.lecturer, "lecturers");

      console.log("👉 Đang insert programs...");
      await queryInterface.bulkInsert(
        "programs",
        [
          {
            program_id: "CT001",
            program_name: "Công nghệ Phần mềm",
            duration: 15,
            description: "Chương trình đào tạo Công nghệ Phần mềm",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            program_id: "CT002",
            program_name: "Trí tuệ nhân tạo",
            duration: 15,
            description: "Chương trình đào tạo Trí tuệ nhân tạo",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      console.log("✅ Insert programs thành công");

      console.log("👉 Đang insert semesters...");
      await queryInterface.bulkInsert(
        "semesters",
        [
          {
            semester_id: "HK1_2024",
            semester_name: "Học kỳ 1, Năm học 2024-2025",
            start_date: "2024-09-01",
            end_date: "2024-12-31",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            semester_id: "HK2_2024",
            semester_name: "Học kỳ 2, Năm học 2024-2025",
            start_date: "2025-01-01",
            end_date: "2025-05-30",
            status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            semester_id: "HK1_2025",
            semester_name: "Học kỳ 1, Năm học 2025-2026",
            start_date: "2025-09-01",
            end_date: "2025-12-31",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      console.log("✅ Insert semesters thành công");

      console.log("👉 Đang insert courses...");
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
        { transaction }
      );

      console.log("👉 Đang insert break_schedule...");
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
        { transaction }
      );

      console.log("👉 Đang insert rooms...");
      await queryInterface.bulkInsert(
        "rooms",
        [
          {
            room_id: "A101",
            room_name: "Phòng A101",
            location: "Tầng 1 - Tòa A",
            capacity: 50,
            status: "available",
            type: "theory",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            room_id: "A102",
            room_name: "Phòng A102",
            location: "Tầng 1 - Tòa A",
            capacity: 50,
            status: "available",
            type: "theory",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );

      console.log("👉 Đang insert subjects...");
      await queryInterface.bulkInsert(
        "subjects",
        [
          {
            subject_id: "MH001",
            subject_name: "Lập trình cơ bản",
            credit: 3,
            theory_hours: 30,
            practice_hours: 15,
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            subject_id: "MH002",
            subject_name: "Cấu trúc dữ liệu và giải thuật",
            credit: 4,
            theory_hours: 45,
            practice_hours: 15,
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            subject_id: "MH009",
            subject_name: "Toán rời rạc",
            credit: 3,
            theory_hours: 30,
            practice_hours: 15,
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      console.log("✅ Insert subjects thành công");

      console.log("👉 Đang insert classes...");
      await queryInterface.bulkInsert(
        "classes",
        [
          {
            class_id: "DH23CS",
            class_name: "Đại học 23 Công nghệ Phần mềm",
            class_size: 30,
            course_id: "K2023",
            program_id: "CT001",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            class_id: "DH23AI",
            class_name: "Đại học 23 Trí tuệ Nhân tạo",
            class_size: 30,
            course_id: "K2023",
            program_id: "CT002",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            class_id: "DH22IT",
            class_name: "Đại học 22 Công nghệ Thông tin",
            class_size: 30,
            course_id: "K2022",
            program_id: "CT002",
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );

      await createUsers("student", users.student, "students");

      // 2. Insert các bảng trung gian phụ thuộc vào các bảng trên
      console.log("👉 Đang insert program_semesters...");
      const programSemestersData = [
        {
          program_semester_id: "PS_CT001_HK1_2024",
          program_id: "CT001",
          semester_id: "HK1_2024",
          semester_number: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          program_semester_id: "PS_CT002_HK1_2024",
          program_id: "CT002",
          semester_id: "HK1_2024",
          semester_number: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          program_semester_id: "PS_CT001_HK1_2025",
          program_id: "CT001",
          semester_id: "HK1_2025",
          semester_number: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          program_semester_id: "PS_CT002_HK1_2025",
          program_id: "CT002",
          semester_id: "HK1_2025",
          semester_number: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      await queryInterface.bulkInsert(
        "program_semesters",
        programSemestersData,
        { transaction }
      );
      console.log("✅ Insert program_semesters thành công");

      // 3. Insert bảng trung gian cuối cùng, phụ thuộc vào program_semesters và subjects
      console.log("👉 Đang insert program_subject_semesters...");
      await queryInterface.bulkInsert(
        "program_subject_semesters",
        [
          {
            ps_semester_id: "PS_MH001_CT001_HK1_2025",
            program_semester_id: "PS_CT001_HK1_2025",
            subject_id: "MH001",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            ps_semester_id: "PS_MH002_CT001_HK1_2025",
            program_semester_id: "PS_CT001_HK1_2025",
            subject_id: "MH002",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            ps_semester_id: "PS_MH009_CT001_HK1_2025",
            program_semester_id: "PS_CT001_HK1_2025",
            subject_id: "MH009",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      console.log("✅ Insert program_subject_semesters thành công");

      // Thêm dữ liệu cho class_schedules
      console.log("👉 Đang insert class_schedules...");
      await queryInterface.bulkInsert(
        "class_schedules",
        [
          {
            semester_id: "PS_CT001_HK1_2025",
            class_id: "DH23CS",
            program_id: "CT001",
            date: "2025-08-19",
            slot_id: "S1",
            subject_id: "MH001",
            lecturer_id: "GV001",
            room_id: "A101",
            status: "active",
            notes: "Môn Lập trình cơ bản - Tiết đầu tuần",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            semester_id: "PS_CT001_HK1_2025",
            class_id: "DH23AI",
            program_id: "CT002",
            date: "2025-08-20",
            slot_id: "S2",
            subject_id: "MH002",
            lecturer_id: "GV002",
            room_id: "A102",
            status: "active",
            notes: "Môn Cấu trúc dữ liệu và giải thuật",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            semester_id: "PS_CT001_HK1_2025",
            class_id: "DH22IT",
            program_id: "CT002",
            date: "2025-08-20",
            slot_id: "C1",
            subject_id: "MH009",
            lecturer_id: "GV002",
            room_id: "A101",
            status: "active",
            notes: "Môn Toán rời rạc - Lý thuyết",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      console.log("✅ Insert class_schedules thành công");

      await transaction.commit();
      console.log("🎉 Seeders have been successfully added!");
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error running seeders:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      console.log("🗑️ Bắt đầu revert seeders...");
      // Xóa theo thứ tự ngược lại để tránh lỗi khóa ngoại
      await queryInterface.bulkDelete("class_schedules", null, { transaction });
      await queryInterface.bulkDelete("students", null, { transaction });
      await queryInterface.bulkDelete("classes", null, { transaction });
      await queryInterface.bulkDelete("courses", null, { transaction });
      await queryInterface.bulkDelete("program_subject_semesters", null, {
        transaction,
      });
      await queryInterface.bulkDelete("subjects", null, { transaction });
      await queryInterface.bulkDelete("program_semesters", null, {
        transaction,
      });
      await queryInterface.bulkDelete("semesters", null, { transaction });
      await queryInterface.bulkDelete("programs", null, { transaction });
      await queryInterface.bulkDelete("lecturers", null, { transaction });
      await queryInterface.bulkDelete("admins", null, { transaction });
      await queryInterface.bulkDelete("training_officers", null, {
        transaction,
      });
      await queryInterface.bulkDelete("rooms", null, { transaction });
      await queryInterface.bulkDelete("break_schedule", null, { transaction });
      await queryInterface.bulkDelete("accounts", null, { transaction });

      await transaction.commit();
      console.log("✅ Seeders have been successfully reverted!");
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error reverting seeders:", error);
      throw error;
    }
  },
};
