// import { add } from "winston";
import models from "../models/index.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import { Op } from "sequelize";
import logger from "../utils/logger.js";

const { Lecturer, Account, sequelize, Subject, LecturerAssignment } = models;
/**
 * Lấy tất cả giảng viên.
 * @returns {Promise<Array>} Danh sách tất cả giảng viên.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllLecturersService = async () => {
  try {
    const alllecturersData = await Lecturer.findAll({
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["id", "email", "role", "status"],
        },
        {
          model: Subject,
          as: "subjects",
          through: { attributes: [] }, // Loại bỏ attributes của bảng trung gian
          attributes: ["subject_id", "subject_name"],
        },
      ],
    });
    return alllecturersData;
  } catch (error) {
    logger.error("Lỗi khi lấy danh sách giảng viên:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết một giảng viên theo ID.
 * @param {string} id - ID của giảng viên.
 * @returns {Promise<Object>} Thông tin giảng viên.
 * @throws {Error} Nếu không tìm thấy giảng viên hoặc có lỗi.
 */
export const getLecturerByIdService = async (lecturerID) => {
  try {
    const lecturerByIdData = await Lecturer.findByPk(id, {
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["id", "email", "role", "status"],
        },
        {
          model: Subject,
          as: "subjects",
          through: { attributes: [] }, // Loại bỏ attributes của bảng trung gian
          attributes: ["subject_id", "subject_name"],
        },
      ],
    });
    if (!lecturerByIdData) {
      throw new Error(`Không tìm thấy giảng viên với ID ${id}`);
    }
    return lecturerByIdData;
  } catch (error) {
    console.error(`Lỗi khi lấy giảng viên với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo một giảng viên mới.
 * @param {Object} lecturerData - Dữ liệu của giảng viên mới.
 * @returns {Promise<Object>} Giảng viên đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo giảng viên.
 */
// export const createLecturerService = async (lecturerData, subjectIds = []) => {
//   const transaction = await sequelize.transaction();

//   try {
//     // Kiểm tra lecturer_id đã tồn tại chưa
//     const existingLecturer = await Lecturer.findByPk(lecturerData.lecturer_id);
//     if (existingLecturer) {
//       throw new Error('Mã giảng viên đã tồn tại');
//     }

//     // Kiểm tra email đã tồn tại chưa
//     const existingAccount = await Account.findOne({
//       where: { email: lecturerData.email }
//     });
//     if (existingAccount) {
//       throw new Error('Email đã tồn tại');
//     }

//     // Tạo tài khoản trước
//     const account = await Account.create({
//       email: lecturerData.email,
//       role: 'lecturer',
//       status: 'active'
//     }, { transaction });

//     // Nếu có subjectIds, kiểm tra các môn học có tồn tại không
//     if (subjectIds && subjectIds.length > 0) {
//       const { Subject } = models;
//       const existingSubjects = await Subject.findAll({
//         where: {
//           subject_id: {
//             [Op.in]: subjectIds
//           }
//         },
//         attributes: ['subject_id']
//       });

//       const existingSubjectIds = existingSubjects.map(s => s.subject_id);
//       const invalidSubjectIds = subjectIds.filter(id => !existingSubjectIds.includes(id));

//       if (invalidSubjectIds.length > 0) {
//         throw new Error(`Các môn học không tồn tại: ${invalidSubjectIds.join(', ')}`);
//       }
//     }

//     // Tạo giảng viên với account_id
//     const lecturer = await Lecturer.create({
//       lecturer_id: lecturerData.lecturer_id,
//       account_id: account.id,
//       name: lecturerData.name,
//       day_of_birth: lecturerData.day_of_birth || null,
//       gender: lecturerData.gender || null,
//       address: lecturerData.address || null,
//       phone_number: lecturerData.phone_number || null,
//       department: lecturerData.department || null,
//       hire_date: lecturerData.hire_date || null,
//       degree: lecturerData.degree || null,
//       academic_rank: lecturerData.academic_rank || null,
//       status: lecturerData.status || 'Đang dạy'
//     }, { transaction });

//     // Gán môn học cho giảng viên nếu có
//     if (subjectIds && subjectIds.length > 0) {
//       const { LecturerAssignment } = models;
//       const assignments = subjectIds.map(subjectId => ({
//         lecturer_id: lecturer.lecturer_id,
//         subject_id: subjectId
//       }));

//       await LecturerAssignment.bulkCreate(assignments, { transaction });
//     }

//     await transaction.commit();

//     // Trả về giảng viên kèm thông tin account
//     const result = await Lecturer.findByPk(lecturer.lecturer_id, {
//       include: [
//         {
//           model: Account,
//           as: 'account',
//           attributes: ['email', 'role', 'status']
//         },
//         {
//           model: models.Subject,
//           as: 'subjects',
//           through: { attributes: [] },
//           attributes: ['subject_id', 'subject_name']
//         }
//       ]
//     });
//     return result;
//   } catch (error) {
//     if (!transaction.finished) {
//       await transaction.rollback();
//     }
//     console.error("Lỗi khi tạo giảng viên:", error);
//     throw error;
//   }
// };

export const createLecturerService = async (lecturerData) => {
  const transaction = await sequelize.transaction();
  try {
    const [existingLecturer, existingAccount] = await Promise.all([
      Lecturer.findByPk(lecturerData.lecturer_id, { transaction }),
      Account.findOne({ where: { email: lecturerData.email }, transaction }),
    ]);

    if (existingLecturer) {
      throw new Error("Mã giảng viên đã tồn tại.");
    }
    if (existingAccount) {
      throw new Error("Email đã tồn tại.");
    }

    // --- 2. Kiểm tra các môn học có tồn tại không (nếu có)
    if (lecturerData.subjects && lecturerData.subjects.length > 0) {
      const existingSubjects = await Subject.findAll({
        where: { subject_id: { [Op.in]: lecturerData.subjects } },
        attributes: ["subject_id"],
        transaction,
      });

      const existingSubjectIds = existingSubjects.map((s) => s.subject_id);
      const invalidSubjectIds = lecturerData.subjects.filter(
        (id) => !existingSubjectIds.includes(id)
      );

      if (invalidSubjectIds.length > 0) {
        throw new Error(
          `Các môn học không tồn tại: ${invalidSubjectIds.join(", ")}`
        );
      }
    }

    // --- 3. Tạo tài khoản và giảng viên
    const account = await Account.create(
      {
        email: lecturerData.email,
        role: "lecturer",
        status: "active",
      },
      { transaction }
    );

    const lecturer = await Lecturer.create(
      {
        lecturer_id: lecturerData.lecturer_id,
        account_id: account.id,
        name: lecturerData.name,
        ...lecturerData, // Gộp các trường dữ liệu còn lại
      },
      { transaction }
    );

    // --- 4. Gán môn học cho giảng viên (nếu có)
    if (lecturerData.subjects && lecturerData.subjects.length > 0) {
      const assignments = lecturerData.subjects.map((subjectId) => ({
        lecturer_id: lecturer.lecturer_id,
        subject_id: subjectId,
      }));
      await LecturerAssignment.bulkCreate(assignments, { transaction });
    }

    // --- 5. Commit transaction
    await transaction.commit();

    // --- 6. Trả về đối tượng đã tạo hoàn chỉnh
    const result = await Lecturer.findByPk(lecturer.lecturer_id, {
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["email", "role", "status"],
        },
        {
          model: Subject,
          as: "subjects",
          through: { attributes: [] },
          attributes: ["subject_id", "subject_name"],
        },
      ],
    });

    return result;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Lỗi khi tạo giảng viên trong service:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một giảng viên theo ID.
 * @param {string} id - ID của giảng viên cần cập nhật.
 * @param {Object} lecturerData - Dữ liệu cập nhật.
 * @returns {Promise<Object>} Giảng viên đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy giảng viên hoặc có lỗi.
 */
export const updateLecturerService = async (id, lecturerData, subjectIds) => {
  const transaction = await models.sequelize.transaction();

  try {
    // 1. Tìm giảng viên cần cập nhật, bao gồm cả tài khoản
    const lecturer = await models.Lecturer.findByPk(id, {
      include: [{ model: models.Account, as: "account" }],
      transaction,
    });

    if (!lecturer) {
      // Trả về null thay vì ném lỗi để controller xử lý 404
      await transaction.rollback();
      return null;
    }

    const { email, ...restOfLecturerData } = lecturerData;

    // 2. Kiểm tra và cập nhật email nếu có thay đổi
    if (email && email !== lecturer.account.email) {
      const existingAccount = await models.Account.findOne({
        where: { email, id: { [Op.ne]: lecturer.account.id } },
        transaction,
      });

      if (existingAccount) {
        throw new Error("Email đã tồn tại.");
      }
      await lecturer.account.update({ email }, { transaction });
    }

    // 3. Cập nhật các trường thông tin giảng viên
    await lecturer.update(restOfLecturerData, { transaction });

    // 4. Cập nhật danh sách môn học (nếu có subjectIds)
    if (subjectIds) {
      // Xóa tất cả các môn học cũ của giảng viên
      await models.LecturerAssignment.destroy({
        where: { lecturer_id: id },
        transaction,
      });

      // Thêm các môn học mới
      if (subjectIds.length > 0) {
        const assignments = subjectIds.map((subjectId) => ({
          lecturer_id: id,
          subject_id: subjectId,
        }));
        await models.LecturerAssignment.bulkCreate(assignments, {
          transaction,
        });
      }
    }

    await transaction.commit();

    // 5. Trả về đối tượng giảng viên đã cập nhật hoàn chỉnh
    return await models.Lecturer.findByPk(id, {
      include: [
        {
          model: models.Account,
          as: "account",
          attributes: ["email", "role", "status"],
        },
        {
          model: models.Subject,
          as: "subjects",
          through: { attributes: [] },
          attributes: ["subject_id", "subject_name"],
        },
      ],
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error(
      `Lỗi trong service khi cập nhật giảng viên với ID ${id}:`,
      error
    );
    throw error;
  }
};

/**
 * Xóa một giảng viên theo ID.
 * @param {string} id - ID của giảng viên cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy giảng viên hoặc có lỗi.
 */
export const deleteLecturerService = async (id) => {
  const transaction = await models.sequelize.transaction();

  try {
    const lecturer = await Lecturer.findByPk(id, {
      include: [
        {
          model: Account,
          as: "account",
        },
      ],
    });

    if (!lecturer) {
      throw new Error(`Không tìm thấy giảng viên với ID ${id}`);
    }
    // lấy account_id từ giảng viên
    const accountId = lecturer.account.id;
    // Xóa account liên kết với giảng viên
    await Account.destroy({
      where: { id: accountId },
      transaction,
    });

    await transaction.commit();

    return { message: "Giảng viên và tài khoản đã được xóa thành công" };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error(`Lỗi khi xóa giảng viên với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Nhập dữ liệu giảng viên từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} lecturersData - Mảng các đối tượng giảng viên.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importLecturersFromJsonService = async (lecturersData) => {
  try {
    if (!lecturersData || !Array.isArray(lecturersData)) {
      throw new Error("Dữ liệu giảng viên không hợp lệ");
    }

    const results = {
      success: [],
      errors: [],
      total: lecturersData.length,
    };

    // Validate và tạo lecturer cho từng item
    for (let i = 0; i < lecturersData.length; i++) {
      const lecturerData = lecturersData[i];
      const index = i + 1;

      try {
        // Validate required fields
        if (
          !lecturerData.lecturer_id ||
          !lecturerData.name ||
          !lecturerData.email
        ) {
          results.errors.push({
            index: index,
            lecturer_id: lecturerData.lecturer_id || "N/A",
            error: "Mã giảng viên, Tên và Email là bắt buộc",
          });
          continue;
        }

        // Clean và format data
        const cleanedData = {
          lecturer_id: lecturerData.lecturer_id.toString().trim(),
          name: lecturerData.name.toString().trim(),
          email: lecturerData.email
            ? lecturerData.email.toString().trim()
            : null,
          day_of_birth: lecturerData.day_of_birth || null,
          gender: lecturerData.gender
            ? lecturerData.gender.toString().trim()
            : null,
          address: lecturerData.address
            ? lecturerData.address.toString().trim()
            : null,
          phone_number: lecturerData.phone_number
            ? lecturerData.phone_number.toString().trim()
            : null,
          department: lecturerData.department
            ? lecturerData.department.toString().trim()
            : null,
          hire_date: lecturerData.hire_date || null,
          degree: lecturerData.degree
            ? lecturerData.degree.toString().trim()
            : null,
          academic_rank: lecturerData.academic_rank
            ? lecturerData.academic_rank.toString().trim()
            : null,
          status: lecturerData.status || "Đang công tác",
        };

        // Xử lý subjectIds (môn học)
        let subjectIds = [];
        if (lecturerData.subjectIds) {
          if (Array.isArray(lecturerData.subjectIds)) {
            subjectIds = lecturerData.subjectIds
              .map((id) => id.toString().trim())
              .filter((id) => id);
          } else if (typeof lecturerData.subjectIds === "string") {
            // Nếu là chuỗi, tách bằng dấu phẩy
            subjectIds = lecturerData.subjectIds
              .split(",")
              .map((id) => id.trim())
              .filter((id) => id);
          }
        }

        // Validate các môn học nếu có
        if (subjectIds.length > 0) {
          const existingSubjects = await Subject.findAll({
            where: {
              subject_id: {
                [Op.in]: subjectIds,
              },
            },
            attributes: ["subject_id"],
          });

          const existingSubjectIds = existingSubjects.map((s) => s.subject_id);
          const invalidSubjectIds = subjectIds.filter(
            (id) => !existingSubjectIds.includes(id)
          );

          if (invalidSubjectIds.length > 0) {
            results.errors.push({
              index: index,
              lecturer_id: cleanedData.lecturer_id,
              error: `Các môn học không tồn tại: ${invalidSubjectIds.join(
                ", "
              )}`,
            });
            continue;
          }
        }

        // Validate email format nếu có
        if (cleanedData.email && !ExcelUtils.isValidEmail(cleanedData.email)) {
          results.errors.push({
            index: index,
            lecturer_id: cleanedData.lecturer_id,
            error: "Email không đúng định dạng",
          });
          continue;
        }

        // Kiểm tra lecturer_id đã tồn tại chưa
        const existingLecturerById = await Lecturer.findOne({
          where: { lecturer_id: cleanedData.lecturer_id },
        });
        if (existingLecturerById) {
          results.errors.push({
            index: index,
            lecturer_id: cleanedData.lecturer_id,
            error: "Mã giảng viên đã tồn tại",
          });
          continue;
        }

        // Kiểm tra email đã tồn tại chưa (nếu có)
        if (cleanedData.email) {
          const existingLecturerByEmail = await Account.findOne({
            where: { email: cleanedData.email },
          });
          if (existingLecturerByEmail) {
            results.errors.push({
              index: index,
              lecturer_id: cleanedData.lecturer_id,
              error: "Email đã tồn tại",
            });
            continue;
          }
        }

        // Tạo lecturer mới với subjects
        const newLecturer = await createLecturerService(
          cleanedData,
          subjectIds
        );
        results.success.push(newLecturer);
      } catch (error) {
        results.errors.push({
          index: index,
          lecturer_id: lecturerData.lecturer_id || "N/A",
          error: error.message || "Lỗi không xác định",
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập giảng viên từ JSON:", error);
    throw error;
  }
};
