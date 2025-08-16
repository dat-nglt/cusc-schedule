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
      // --- Dữ liệu cho các vai trò người dùng (Bảng cha đầu tiên) ---
      const users = {
        admin: [
          { name: "Nguyễn Lê Tấn Đạt", email: "nguyenletandat.contact@gmail.com", type: "Super Admin" },
        ],
        training_officer: [
          { name: "Phạm Thị D (Cán bộ ĐT)", email: "dhchuong@student.ctuet.edu.vn", department: "Phòng Đào tạo", position: "Trưởng phòng" },
        ],
        student: [
          { name: "Lê Văn C (Sinh viên)", email: "student@example.com", student_id: "SV001", admission_year: "2023-09-01", gpa: 3.5, class_id: "DH23CS" },
        ],
        lecturer: [
          {
            id: "GV001", name: "Trần Thị B", email: "lecturer1@example.com", department: "Khoa Công nghệ thông tin", degree: "Tiến sĩ", academic_rank: "Phó Giáo sư",
            phone_number: "0901234567", gender: "Nữ", address: "Cần Thơ", day_of_birth: "1980-05-15"
          },
          {
            id: "GV002", name: "Nguyễn Văn A", email: "lecturer2@example.com", department: "Khoa Công nghệ thông tin", degree: "Thạc sĩ", academic_rank: "Giảng viên chính",
            phone_number: "0901234568", gender: "Nam", address: "Hồ Chí Minh", day_of_birth: "1982-11-20"
          },
          {
            id: "GV003", name: "Lê Thị C", email: "lecturer3@example.com", department: "Khoa Khoa học tự nhiên", degree: "Tiến sĩ", academic_rank: "Giảng viên cao cấp",
            phone_number: "0901234569", gender: "Nữ", address: "Hà Nội", day_of_birth: "1975-08-01"
          },
          {
            id: "GV004", name: "Phạm Minh D", email: "lecturer4@example.com", department: "Khoa Ngoại ngữ", degree: "Thạc sĩ", academic_rank: "Giảng viên",
            phone_number: "0901234570", gender: "Nam", address: "Đà Nẵng", day_of_birth: "1990-03-25"
          },
          {
            id: "GV005", name: "Hoàng Văn E", email: "lecturer5@example.com", department: "Khoa Kinh tế", degree: "Tiến sĩ", academic_rank: "Phó Giáo sư",
            phone_number: "0901234571", gender: "Nam", address: "Cần Thơ", day_of_birth: "1978-07-10"
          },
          {
            id: "GV006", name: "Đặng Thu F", email: "lecturer6@example.com", department: "Khoa Kinh tế", degree: "Thạc sĩ", academic_rank: "Giảng viên",
            phone_number: "0901234572", gender: "Nữ", address: "Cần Thơ", day_of_birth: "1985-09-05"
          },
          {
            id: "GV007", name: "Võ Thị G", email: "lecturer7@example.com", department: "Khoa Khoa học xã hội", degree: "Tiến sĩ", academic_rank: "Giảng viên chính",
            phone_number: "0901234573", gender: "Nữ", address: "Hồ Chí Minh", day_of_birth: "1981-02-28"
          },
          {
            id: "GV008", name: "Đỗ Bá H", email: "lecturer8@example.com", department: "Khoa Khoa học xã hội", degree: "Thạc sĩ", academic_rank: "Giảng viên",
            phone_number: "0901234574", gender: "Nam", address: "Cần Thơ", day_of_birth: "1992-12-12"
          },
          {
            id: "GV009", name: "Bùi Đình I", email: "lecturer9@example.com", department: "Khoa Công nghệ thông tin", degree: "Thạc sĩ", academic_rank: "Giảng viên",
            phone_number: "0901234575", gender: "Nam", address: "Cần Thơ", day_of_birth: "1988-04-30"
          },
          {
            id: "GV010", name: "Trương Thị K", email: "lecturer10@example.com", department: "Khoa Công nghệ thông tin", degree: "Tiến sĩ", academic_rank: "Giảng viên chính",
            phone_number: "0901234576", gender: "Nữ", address: "Đà Nẵng", day_of_birth: "1979-10-18"
          },
        ],
      };

      // Hàm helper để tạo Accounts và chi tiết cho từng vai trò
      const createUsers = async (role, userData) => {
        const accounts = userData.map(user => ({
          id: uuidv4(),
          email: user.email,
          role,
          google_id: null,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        }));
        await queryInterface.bulkInsert("accounts", accounts, { transaction });

        const details = userData.map((user, index) => {
          const baseDetails = {
            account_id: accounts[index].id,
            created_at: new Date(),
            updated_at: new Date(),
          };
          switch (role) {
            case "admin":
              return { ...baseDetails, admin_id: "AD001", name: user.name, admin_type: user.type };
            case "lecturer":
              return { ...baseDetails, lecturer_id: user.id, name: user.name, department: user.department, hire_date: "2010-09-01", degree: user.degree, academic_rank: user.academic_rank, phone_number: user.phone_number, gender: user.gender, address: user.address, day_of_birth: user.day_of_birth, status: 'active' };
            case "training_officer":
              return { ...baseDetails, staff_id: "CB001", name: user.name, department: user.department, position: user.position, status: "active" };
            case "student":
              return { ...baseDetails, student_id: user.student_id, name: user.name, class_id: user.class_id, admission_year: user.admission_year, gpa: user.gpa };
            default:
              return baseDetails;
          }
        });
        await queryInterface.bulkInsert(`${role}s`, details, { transaction });
      };

      await createUsers("admin", users.admin);
      await createUsers("training_officer", users.training_officer);
      await createUsers("lecturer", users.lecturer);

      // --- Dữ liệu cho Programs ---
      await queryInterface.bulkInsert("programs", [
        { program_id: "CT001", program_name: "Công nghệ Phần mềm", duration: 15, description: "Chương trình đào tạo Công nghệ Phần mềm", status: "active", created_at: new Date(), updated_at: new Date() },
        { program_id: "CT002", program_name: "Trí tuệ nhân tạo", duration: 15, description: "Chương trình đào tạo Trí tuệ nhân tạo", status: "active", created_at: new Date(), updated_at: new Date() },
        { program_id: "CT003", program_name: "Công nghệ thông tin", duration: 15, description: "Chương trình đào tạo Công nghệ thông tin", status: "active", created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      // --- Dữ liệu cho Courses (Bảng cha của Classes) ---
      await queryInterface.bulkInsert("courses", [
        { course_id: "K2023", course_name: "Khóa 2023-2027", start_date: "2023-09-01", end_date: "2027-08-31", status: "active", created_at: new Date(), updated_at: new Date() },
        { course_id: "K2022", course_name: "Khóa 2022-2026", start_date: "2022-09-01", end_date: "2026-08-31", status: "active", created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      // --- Dữ liệu cho Classes (Bảng con của Courses và Bảng cha của Students) ---
      await queryInterface.bulkInsert("classes", [
        { class_id: "DH23CS", class_name: "Đại học 23 Công nghệ Phần mềm", class_size: 60, status: "active", course_id: "K2023", created_at: new Date(), updated_at: new Date() },
        { class_id: "DH22IT", class_name: "Đại học 22 Công nghệ thông tin", class_size: 70, status: "active", course_id: "K2022", created_at: new Date(), updated_at: new Date() },
        { class_id: "DH23AI", class_name: "Đại học 23 Trí tuệ nhân tạo", class_size: 55, status: "active", course_id: "K2023", created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      // --- Dữ liệu cho Students (Bảng con của Classes) ---
      await createUsers("student", users.student);

      // --- Dữ liệu cho Semesters ---
      await queryInterface.bulkInsert("semesters", [
        { semester_id: "HK1_2024", semester_name: "Học kỳ 1, Năm học 2024-2025", program_id: "CT001", start_date: "2024-09-01", end_date: "2024-12-31", status: "active", created_at: new Date(), updated_at: new Date() },
        { semester_id: "HK2_2024", semester_name: "Học kỳ 2, Năm học 2024-2025", program_id: "CT001", start_date: "2025-01-01", end_date: "2025-05-30", status: "pending", created_at: new Date(), updated_at: new Date() },
        { semester_id: "HK1_2024_AI", semester_name: "Học kỳ 1, Năm học 2024-2025", program_id: "CT002", start_date: "2024-09-01", end_date: "2024-12-31", status: "active", created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      // --- Dữ liệu cho Subjects ---
      await queryInterface.bulkInsert("subjects", [
        { subject_id: "CS101", subject_name: "Lập trình cơ bản", credit: 3, theory_hours: 30, practice_hours: 15, status: "active", semester_id: "HK1_2024", created_at: new Date(), updated_at: new Date() },
        { subject_id: "CS102", subject_name: "Cấu trúc dữ liệu", credit: 4, theory_hours: 45, practice_hours: 15, status: "active", semester_id: "HK1_2024", created_at: new Date(), updated_at: new Date() },
        { subject_id: "CS201", subject_name: "Cơ sở dữ liệu", credit: 3, theory_hours: 30, practice_hours: 15, status: "active", semester_id: "HK2_2024", created_at: new Date(), updated_at: new Date() },
        { subject_id: "AI101", subject_name: "Nhập môn Trí tuệ nhân tạo", credit: 3, theory_hours: 30, practice_hours: 15, status: "active", semester_id: "HK1_2024_AI", created_at: new Date(), updated_at: new Date() },
        { subject_id: "MA101", subject_name: "Đại số tuyến tính", credit: 3, theory_hours: 45, practice_hours: 0, status: "active", semester_id: "HK1_2024_AI", created_at: new Date(), updated_at: new Date() },
        { subject_id: "GEN101", subject_name: "Giáo dục thể chất", credit: 2, theory_hours: 15, practice_hours: 30, status: "active", semester_id: null, created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      // --- Dữ liệu cho Break Schedules ---
      await queryInterface.bulkInsert("break_schedule", [
        { break_id: "TT001", break_start_date: "2025-01-20", break_end_date: "2025-02-10", number_of_days: 22, break_type: "Nghỉ Tết Nguyên Đán", description: "Nghỉ Tết Giáp Thìn", status: "active", created_at: new Date(), updated_at: new Date() },
        { break_id: "NL001", break_start_date: "2024-04-30", break_end_date: "2024-05-01", number_of_days: 2, break_type: "Nghỉ lễ", description: "Nghỉ lễ 30/4 và 1/5", status: "completed", created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      // --- Dữ liệu cho Rooms ---
      await queryInterface.bulkInsert("rooms", [
        { room_id: "A101", room_name: "Phòng A101", location: "Tầng 1 - Tòa A", capacity: 50, status: "available", type: "theory", created_at: new Date(), updated_at: new Date() },
        { room_id: "A102", room_name: "Phòng A102", location: "Tầng 1 - Tòa A", capacity: 50, status: "available", type: "theory", created_at: new Date(), updated_at: new Date() },
        { room_id: "B201", room_name: "Phòng B201", location: "Tầng 2 - Tòa B", capacity: 30, status: "available", type: "practice", created_at: new Date(), updated_at: new Date() },
        { room_id: "B202", room_name: "Phòng B202", location: "Tầng 2 - Tòa B", capacity: 30, status: "available", type: "practice", created_at: new Date(), updated_at: new Date() },
        { room_id: "C301", room_name: "Phòng C301", location: "Tầng 3 - Tòa C", capacity: 100, status: "available", type: "theory", created_at: new Date(), updated_at: new Date() },
        { room_id: "C302", room_name: "Phòng C302", location: "Tầng 3 - Tòa C", capacity: 100, status: "available", type: "theory", created_at: new Date(), updated_at: new Date() },
        { room_id: "D401", room_name: "Phòng D401", location: "Tầng 4 - Tòa D", capacity: 40, status: "available", type: "practice", created_at: new Date(), updated_at: new Date() },
        { room_id: "D402", room_name: "Phòng D402", location: "Tầng 4 - Tòa D", capacity: 40, status: "available", type: "practice", created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      await transaction.commit();
      console.log("Seeders have been successfully added!");
    } catch (error) {
      await transaction.rollback();
      console.error("Error running seeders:", error);
      throw error;
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
      // Xóa dữ liệu theo thứ tự ngược lại để tránh lỗi khóa ngoại
      await queryInterface.bulkDelete("students", null, { transaction });
      await queryInterface.bulkDelete("classes", null, { transaction });
      await queryInterface.bulkDelete("courses", null, { transaction });
      await queryInterface.bulkDelete("rooms", null, { transaction });
      await queryInterface.bulkDelete("break_schedule", null, { transaction });
      await queryInterface.bulkDelete("subjects", null, { transaction });
      await queryInterface.bulkDelete("semesters", null, { transaction });
      await queryInterface.bulkDelete("programs", null, { transaction });
      await queryInterface.bulkDelete("lecturers", null, { transaction });
      await queryInterface.bulkDelete("admins", null, { transaction });
      await queryInterface.bulkDelete("training_officers", null, { transaction });
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