// import { add } from "winston";
import models from "../models/index.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import { Op } from "sequelize";
import logger from "../utils/logger.js";

const {
  Lecturer,
  Account,
  sequelize,
  Subject,
  LecturerAssignment,
  BusySlot,
  SemesterBusySlot,
} = models;
/**
 * Lấy tất cả giảng viên.
 * @returns {Promise<Array>} Danh sách tất cả giảng viên.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllLecturersService = async () => {
  try {
    // Lấy dữ liệu giảng viên kèm account, môn học và busy_slots
    const allLecturersData = await Lecturer.findAll({
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["id", "email", "role", "status"],
        },
        {
          model: Subject,
          as: "subjects",
          through: { attributes: [] },
          attributes: ["subject_id", "subject_name"],
        },
        {
          model: BusySlot,
          as: "busy_slots",
          attributes: ["day", "slot_id"],
        },
      ],
    });

    // Lấy toàn bộ email từ bảng Account
    // Điều này giúp bạn có thể kiểm tra trùng lặp email cho cả giảng viên và sinh viên
    const allAccounts = await Account.findAll({
      attributes: ["id", "email", "role", "status"],
    });

    // Làm phẳng dữ liệu giảng viên
    const lecturersWithExtras = allLecturersData.map((lecturer) => {
      const plainLecturer = lecturer.get({ plain: true });

      return {
        ...plainLecturer,
        email: plainLecturer.account?.email || null,
        role: plainLecturer.account?.role || null,
        status: plainLecturer.account?.status || null,
      };
    });

    return {
      lecturers: lecturersWithExtras,
      allAccounts, // Trả về danh sách tất cả tài khoản
    };
  } catch (error) {
    logger.error("Lỗi khi lấy danh sách giảng viên:", error);
    throw new Error("Lấy danh sách giảng viên không thành công");
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
export const createLecturerService = async (
  newLecturerData,
  newLecturerSubjects,
  busySlots,
  semesterBusySlots
) => {
  const transaction = await sequelize.transaction();
  try {
    // --- 1. Kiểm tra trùng ID / email
    const [existingLecturer, existingAccount] = await Promise.all([
      Lecturer.findByPk(newLecturerData.lecturer_id, { transaction }),
      Account.findOne({ where: { email: newLecturerData.email }, transaction }),
    ]);

    if (existingLecturer) {
      throw new Error(
        `Mã giảng viên "${newLecturerData.lecturer_id}" đã tồn tại.`
      );
    }
    if (existingAccount) {
      throw new Error(`Email "${newLecturerData.email}" đã tồn tại.`);
    }

    // --- 2. Kiểm tra môn học hợp lệ
    if (newLecturerSubjects && newLecturerSubjects.length > 0) {
      const existingSubjects = await Subject.findAll({
        where: {
          subject_id: {
            [Op.in]: newLecturerSubjects,
          },
        },
        attributes: ["subject_id"],
        transaction,
      });

      const existingSubjectIds = existingSubjects.map((s) => s.subject_id);
      const invalidSubjectIds = newLecturerSubjects.filter(
        (id) => !existingSubjectIds.includes(id)
      );

      if (invalidSubjectIds.length > 0) {
        throw new Error(
          `Các môn học không tồn tại: ${invalidSubjectIds.join(", ")}`
        );
      }
    }

    // --- 3. Tạo Account và Lecturer
    const account = await Account.create(
      {
        email: newLecturerData.email,
        role: "lecturer",
        status: "active",
        google_id: newLecturerData.google_id || null,
      },
      { transaction }
    );

    const lecturer = await Lecturer.create(
      {
        lecturer_id: newLecturerData.lecturer_id,
        account_id: account.id,
        name: newLecturerData.name,
        department: newLecturerData.department,
        degree: newLecturerData.degree,
        phone_number: newLecturerData.phone_number,
        gender: newLecturerData.gender,
        address: newLecturerData.address,
        day_of_birth: newLecturerData.day_of_birth,
        status: newLecturerData.status,
      },
      { transaction }
    );

    // --- 4. Gán môn học
    if (newLecturerSubjects && newLecturerSubjects.length > 0) {
      const assignments = newLecturerSubjects.map((subjectId) => ({
        lecturer_id: lecturer.lecturer_id,
        subject_id: subjectId,
      }));
      await LecturerAssignment.bulkCreate(assignments, { transaction });
    }

    // --- 5. Gán busySlots (tuần)
    if (busySlots && busySlots.length > 0) {
      const busy = busySlots.map((slot) => ({
        lecturer_id: lecturer.lecturer_id,
        day: slot.day,
        slot_id: slot.slot_id,
      }));
      await BusySlot.bulkCreate(busy, { transaction });
    }

    if (Array.isArray(semesterBusySlots) && semesterBusySlots.length > 0) {
      const semesterBusy = semesterBusySlots.map((slot) => ({
        lecturer_id: lecturer.lecturer_id,
        date: slot.date,
        slot_id: slot.slot_id || null, // đảm bảo có slot_id hoặc null
      }));

      await models.SemesterBusySlot.bulkCreate(semesterBusy, { transaction });
    }

    // --- 7. Commit
    await transaction.commit();

    // --- 8. Trả về lecturer kèm account + subjects
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
    console.error("Lỗi khi tạo giảng viên:", error);
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
export const updateLecturerService = async (
  lecturerId,
  updatedLecturerData,
  updatedSubjects = [],
  busySlots = [],
  semesterBusySlots = []
) => {
  const transaction = await sequelize.transaction();

  try {
    // --- 1. Tìm giảng viên kèm account
    const lecturer = await Lecturer.findByPk(lecturerId, {
      include: [{ model: Account, as: "account" }],
      transaction,
    });

    if (!lecturer) {
      await transaction.rollback();
      return null;
    }

    const { email, ...restOfLecturerData } = updatedLecturerData;

    // --- 2. Kiểm tra email mới
    if (email && email !== lecturer.account.email) {
      const existingAccount = await Account.findOne({
        where: { email, id: { [Op.ne]: lecturer.account.id } },
        transaction,
      });

      if (existingAccount) {
        throw new Error(`Email "${email}" đã tồn tại.`);
      }

      await lecturer.account.update({ email }, { transaction });
    }

    // --- 4. Cập nhật thông tin giảng viên
    await lecturer.update(restOfLecturerData, { transaction });

    // --- 5. Cập nhật danh sách môn học
    if (updatedSubjects && updatedSubjects.length > 0) {
      const existingSubjects = await Subject.findAll({
        where: { subject_id: { [Op.in]: updatedSubjects } },
        attributes: ["subject_id"],
        transaction,
      });

      const existingSubjectIds = existingSubjects.map((s) => s.subject_id);
      const invalidSubjectIds = updatedSubjects.filter(
        (id) => !existingSubjectIds.includes(id)
      );

      if (invalidSubjectIds.length > 0) {
        throw new Error(
          `Các môn học không tồn tại: ${invalidSubjectIds.join(", ")}`
        );
      }

      await LecturerAssignment.destroy({
        where: { lecturer_id: lecturerId },
        transaction,
      });

      const assignments = updatedSubjects.map((subjectId) => ({
        lecturer_id: lecturerId,
        subject_id: subjectId,
      }));
      await LecturerAssignment.bulkCreate(assignments, { transaction });
    }

    // --- 6. Cập nhật busySlots
    if (busySlots && busySlots.length > 0) {
      await BusySlot.destroy({
        where: { lecturer_id: lecturerId },
        transaction,
      });

      const busy = busySlots.map((slot) => ({
        lecturer_id: lecturerId,
        day: slot.day,
        slot_id: slot.slot_id,
      }));

      await BusySlot.bulkCreate(busy, { transaction });
    }

    // --- 7. Cập nhật semesterBusySlots
    if (Array.isArray(semesterBusySlots) && semesterBusySlots.length > 0) {
      await models.SemesterBusySlot.destroy({
        where: { lecturer_id: lecturerId },
        transaction,
      });

      const semesterBusy = semesterBusySlots.map((slot) => ({
        lecturer_id: lecturerId,
        date: slot.date,
        slot_id: slot.slot_id || null,
      }));

      await models.SemesterBusySlot.bulkCreate(semesterBusy, { transaction });
    }

    // --- 8. Commit transaction
    await transaction.commit();

    // --- 9. Trả về lecturer đầy đủ
    const result = await Lecturer.findByPk(lecturerId, {
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
    console.error(`Lỗi khi cập nhật giảng viên ID ${lecturerId}:`, error);
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
        { model: Account, as: "account" },
        { model: BusySlot, as: "busy_slots" },
        { model: SemesterBusySlot, as: "semester_busy_slots" },
        { model: Subject, as: "subjects" }, // nếu có quan hệ N-N
      ],
      transaction,
      paranoid: false, // lấy cả dữ liệu đã soft delete
    });

    if (!lecturer) {
      throw new Error(`Không tìm thấy giảng viên với ID ${id}`);
    }

    // Soft delete account
    if (lecturer.account) {
      await lecturer.account.destroy({ transaction });
    }

    // Soft delete busy slots
    if (lecturer.busy_slots?.length > 0) {
      await Promise.all(
        lecturer.busy_slots.map((slot) => slot.destroy({ transaction }))
      );
    }

    // Soft delete semester busy slots
    if (lecturer.semester_busy_slots?.length > 0) {
      await Promise.all(
        lecturer.semester_busy_slots.map((slot) =>
          slot.destroy({ transaction })
        )
      );
    }

    // Nếu có quan hệ N-N với Subject → xoá soft bằng cách xóa bản ghi join table
    if (lecturer.subjects?.length > 0) {
      await lecturer.removeSubjects(lecturer.subjects, { transaction });
    }

    // Cuối cùng xoá giảng viên
    await lecturer.destroy({ transaction });

    await transaction.commit();
    return { message: "Giảng viên và dữ liệu liên quan đã được xoá mềm" };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
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
