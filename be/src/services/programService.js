import models from "../models/index.js";

const {
  sequelize,
  Program,
  Semester,
  Subject,
  ProgramSemesters,
  ProgramSubjectSemesters,
} = models;
/**
 * Lấy tất cả các chương trình đào tạo.
 * @returns {Promise<Array>} Danh sách tất cả các chương trình.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllProgramsService = async () => {
  try {
    const programs = await Program.findAll();
    return programs;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chương trình đào tạo:", error);
    throw error;
  }
};

/**
 * Lấy thông tin một chương trình đào tạo theo ID.
 * @param {string} id - ID của chương trình.
 * @returns {Promise<Object|null>} Chương trình tìm thấy hoặc null nếu không tìm thấy.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getProgramByIdService = async (id) => {
  try {
    const program = await Program.findByPk(id);
    return program;
  } catch (error) {
    console.error(`Lỗi khi lấy chương trình với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo một chương trình đào tạo mới.
 * @param {Object} programData - Dữ liệu của chương trình mới.
 * @returns {Promise<Object>} Chương trình đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo chương trình.
 */

export const createProgramService = async (programData) => {
  // Sử dụng transaction để đảm bảo tất cả các thao tác đều thành công
  const t = await sequelize.transaction();
  try {
    // Kiểm tra dữ liệu đầu vào bắt buộc
    if (
      !programData.program_id ||
      !programData.program_name ||
      !programData.semesters
    ) {
      const error = new Error(
        "Dữ liệu không hợp lệ. Vui lòng cung cấp đủ thông tin chương trình và học kỳ."
      );
      error.name = "ValidationError";
      throw error;
    }

    // 1. Tạo bản ghi Program chính
    const newProgram = await Program.create(
      {
        program_id: programData.program_id,
        program_name: programData.program_name,
        status: programData.status,
      },
      { transaction: t }
    );

    // 2. Lặp qua danh sách semesters và subjects để tạo bản ghi
    const semestersData = programData.semesters;
    if (semestersData && semestersData.length > 0) {
      for (const [index, semester] of semestersData.entries()) {
        const programSemesterId =
          `PS_${newProgram.program_id}_${semester.semester_id}`.toUpperCase();

        await ProgramSemesters.create(
          {
            program_semester_id: programSemesterId,
            program_id: newProgram.program_id,
            semester_id: semester.semester_id,
            semester_number: index + 1,
          },
          { transaction: t }
        );

        const subjectsData = semester.subjects;
        if (subjectsData && subjectsData.length > 0) {
          for (const subject of subjectsData) {
            const psSemesterId =
              `PSS_${programSemesterId}_${subject.subject_id}`.toUpperCase();

            await ProgramSubjectSemesters.create(
              {
                ps_semester_id: psSemesterId,
                program_semester_id: programSemesterId,
                subject_id: subject.subject_id,
              },
              { transaction: t }
            );
          }
        }
      }
    }

    // Commit transaction
    await t.commit();

    return newProgram;
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await t.rollback();
    console.error("Lỗi khi tạo chương trình đào tạo:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};

/**
 * Cập nhật thông tin một chương trình đào tạo.
 * @param {string} id - ID của chương trình cần cập nhật.
 * @param {Object} programData - Dữ liệu cập nhật cho chương trình.
 * @returns {Promise<Object>} Chương trình đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy chương trình hoặc có lỗi.
 */
export const updateProgramService = async (id, programData) => {
  try {
    const program = await Program.findByPk(id);
    if (!program) throw new Error("Không tìm thấy chương trình đào tạo");
    return await program.update(programData);
  } catch (error) {
    console.error(`Lỗi khi cập nhật chương trình với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa một chương trình đào tạo.
 * @param {string} id - ID của chương trình cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy chương trình hoặc có lỗi.
 */
export const deleteProgramService = async (id) => {
  try {
    const program = await Program.findByPk(id);
    if (!program) throw new Error("Không tìm thấy chương trình đào tạo");
    await program.destroy();
    return { message: "Chương trình đã được xóa thành công" };
  } catch (error) {
    console.error(`Lỗi khi xóa chương trình với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Nhập dữ liệu chương trình đào tạo từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} programsData - Mảng các đối tượng chương trình đào tạo.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importProgramsFromJSONService = async (programsData) => {
  try {
    if (!programsData || !Array.isArray(programsData)) {
      throw new Error("Dữ liệu chương trình đào tạo không hợp lệ");
    }

    const results = {
      success: [],
      errors: [],
      total: programsData.length,
    };

    // Duyệt qua từng item để validate và tạo chương trình
    for (let i = 0; i < programsData.length; i++) {
      const programData = programsData[i];
      const index = i + 1;

      try {
        // Validate các trường bắt buộc
        if (!programData.program_id) {
          results.errors.push({
            index: index,
            program_id: programData.program_id || "N/A",
            error: "Mã chương trình là bắt buộc",
          });
          continue;
        }

        // Làm sạch và định dạng dữ liệu
        const cleanedData = {
          program_id: programData.program_id.toString().trim(),
          program_name: programData.program_name
            ? programData.program_name.toString().trim()
            : null,
          training_duration: programData.training_duration
            ? parseFloat(programData.training_duration)
            : null,
          description: programData.description
            ? programData.description.toString().trim()
            : null,
          status: programData.status
            ? programData.status.toString().trim()
            : "Hoạt động",
        };

        // Validate training_duration nếu được cung cấp
        if (
          cleanedData.training_duration !== null &&
          (isNaN(cleanedData.training_duration) ||
            cleanedData.training_duration < 0)
        ) {
          results.errors.push({
            index: index,
            program_id: cleanedData.program_id,
            error: "Thời gian đào tạo phải là số dương",
          });
          continue;
        }

        // Kiểm tra program_id đã tồn tại chưa
        const existingProgram = await Program.findOne({
          where: { program_id: cleanedData.program_id },
        });
        if (existingProgram) {
          results.errors.push({
            index: index,
            program_id: cleanedData.program_id,
            error: "Mã chương trình đã tồn tại",
          });
          continue;
        }

        // Tạo Program mới
        const newProgram = await Program.create(cleanedData);
        results.success.push(newProgram);
      } catch (error) {
        results.errors.push({
          index: index,
          program_id: programData.program_id || "N/A",
          error: error.message || "Lỗi không xác định",
        });
      }
    }
    return results;
  } catch (error) {
    console.error("Lỗi khi nhập chương trình đào tạo từ JSON:", error);
    throw error;
  }
};

/**
 * Lấy danh sách chương trình đào tạo với cấu trúc để tạo thời khóa biểu.
 * @returns {Promise<Object>} Danh sách chương trình với cấu trúc semesters và subjects.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getProgramCreateScheduleService = async () => {
  try {
    const programs = await Program.findAll({
      attributes: ["program_id", "program_name", "duration"],
      include: [
        {
          model: ProgramSemesters,
          as: "program_semesters",
          attributes: ["program_semester_id", "semester_number"],
          include: [
            {
              model: Semester,
              as: "semester",
              attributes: [
                "semester_id",
                "start_date",
                "end_date",
                "duration_weeks",
              ],
            },
            {
              model: ProgramSubjectSemesters,
              as: "program_subjects",
              attributes: ["subject_id"],
              include: [
                {
                  model: Subject,
                  as: "subject",
                  attributes: [
                    "subject_id",
                    "subject_name",
                    "theory_hours",
                    "practice_hours",
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // Tạo các maps để lưu trữ dữ liệu unique
    const semestersMap = new Map();
    const subjectsMap = new Map();

    // Chuyển đổi sang cấu trúc JSON yêu cầu
    const formattedPrograms = programs.map((program) => {
      const semesters = program.program_semesters
        .sort((a, b) => (a.semester_number || 0) - (b.semester_number || 0))
        .map((programSemester) => {
          const semester = programSemester.semester;
          const subjectIds = programSemester.program_subjects.map(
            (ps) => ps.subject_id
          );

          // Helper function to safely convert date to string
          const formatDate = (date) => {
            if (!date) return null;
            if (date instanceof Date) {
              return date.toISOString().split("T")[0];
            }
            if (typeof date === "string") {
              const parsedDate = new Date(date);
              return isNaN(parsedDate.getTime())
                ? null
                : parsedDate.toISOString().split("T")[0];
            }
            return null;
          };

          // Thêm semester vào map nếu chưa có - sử dụng program_semester_id làm key
          if (!semestersMap.has(programSemester.program_semester_id)) {
            semestersMap.set(programSemester.program_semester_id, {
              semester_id: programSemester.program_semester_id,
              subject_ids: subjectIds,
              start_date: semester ? formatDate(semester.start_date) : null,
              end_date: semester ? formatDate(semester.end_date) : null,
              duration_weeks: semester ? semester.duration_weeks : null,
            });
          }

          // Thêm subjects vào map
          programSemester.program_subjects.forEach((ps) => {
            if (ps.subject && !subjectsMap.has(ps.subject.subject_id)) {
              subjectsMap.set(ps.subject.subject_id, {
                subject_id: ps.subject.subject_id,
                name: ps.subject.subject_name,
                theory_hours: ps.subject.theory_hours,
                practice_hours: ps.subject.practice_hours,
              });
            }
          });
          return {
            semester_id: programSemester.program_semester_id,
            subject_ids: subjectIds,
          };
        });

      return {
        program_id: program.program_id,
        program_name: program.program_name,
        duration: program.duration,
        semesters: semesters,
      };
    });

    return {
      programs: formattedPrograms,
      semesters: Array.from(semestersMap.values()),
      subjects: Array.from(subjectsMap.values()),
    };
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách chương trình để tạo thời khóa biểu:",
      error
    );
    throw error;
  }
};
