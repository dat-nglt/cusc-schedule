// import { add } from "winston";
import models from "../models/index.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import { Op } from "sequelize";
import logger from "../utils/logger.js";

const { Lecturer, Account, sequelize, Subject, LecturerAssignment, BusySlot, SemesterBusySlot } = models;
/**
 * Lấy tất cả giảng viên.
 * @returns {Promise<Array>} Danh sách tất cả giảng viên.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllLecturersService = async () => {
  try {
    const alllecturersData = await Lecturer.findAll({
      include: [{
        model: Account,
        as: 'account',
        attributes: ['id', 'email', 'role', 'status']
      },
      {
        model: Subject,
        as: 'subjects',
        through: { attributes: [] }, // Loại bỏ attributes của bảng trung gian
        attributes: ['subject_id', 'subject_name']
      },
      {
        model: BusySlot,
        as: 'busy_slots',
        attributes: ['day', 'slot_id']
      },
      {
        model: SemesterBusySlot,
        as: 'semester_busy_slots',
        attributes: ['date', 'slot_id']
      }
      ]
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
    const lecturerByIdData = await Lecturer.findByPk(lecturerID, {
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
      throw new Error(`Không tìm thấy giảng viên với ID ${lecturerID}`);
    }
    return lecturerByIdData;
  } catch (error) {
    console.error(`Lỗi khi lấy giảng viên với ID ${lecturerID}:`, error);
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

// // Nếu có subjectIds, kiểm tra các môn học có tồn tại không
// if (subjectIds && subjectIds.length > 0) {
//   const { Subject } = models;
//   const existingSubjects = await Subject.findAll({
//     where: {
//       subject_id: {
//         [Op.in]: subjectIds
//       }
//     },
//     attributes: ['subject_id']
//   });

//   const existingSubjectIds = existingSubjects.map(s => s.subject_id);
//   const invalidSubjectIds = subjectIds.filter(id => !existingSubjectIds.includes(id));

//   if (invalidSubjectIds.length > 0) {
//     throw new Error(`Các môn học không tồn tại: ${invalidSubjectIds.join(', ')}`);
//   }
// }

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

export const createLecturerService = async (lecturerData, subjects = [], busySlots = [], semesterBusySlots = []) => {
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


    if (subjects && subjects.length > 0) {
      const { Subject } = models;
      const existingSubjects = await Subject.findAll({
        where: {
          subject_id: {
            [Op.in]: subjects
          }
        },
        attributes: ['subject_id']
      });

      const existingSubjectIds = existingSubjects.map(s => s.subject_id);
      const invalidSubjectIds = subjects.filter(id => !existingSubjectIds.includes(id));

      if (invalidSubjectIds.length > 0) {
        throw new Error(`Các môn học không tồn tại: ${invalidSubjectIds.join(', ')}`);
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
    if (subjects && subjects.length > 0) {
      const { LecturerAssignment } = models;
      const assignments = subjects.map(subjectId => ({
        lecturer_id: lecturer.lecturer_id,
        subject_id: subjectId
      }));

      await LecturerAssignment.bulkCreate(assignments, { transaction });
    }

    // --- 5. Gán busy slots cho giảng viên (nếu có)
    if (busySlots && busySlots.length > 0) {
      const busySlotsData = busySlots.map(slot => ({
        lecturer_id: lecturer.lecturer_id,
        day: slot.day,
        slot_id: slot.slot_id
      }));

      await BusySlot.bulkCreate(busySlotsData, { transaction });
    }
    // --- 6. Gán semester busy slots cho giảng viên (nếu có)
    if (semesterBusySlots && semesterBusySlots.length > 0) {
      const semesterBusySlotsData = semesterBusySlots.map(slot => ({
        lecturer_id: lecturer.lecturer_id,
        date: slot.date,
        slot_id: slot.slot_id
      }));
      await SemesterBusySlot.bulkCreate(semesterBusySlotsData, { transaction });
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
        {
          model: BusySlot,
          as: "busy_slots",
          attributes: ["day", "slot_id"],
        },
        {
          model: SemesterBusySlot,
          as: "semester_busy_slots",
          attributes: ["date", "slot_id"],
        }
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
export const updateLecturerService = async (id, lecturerData, subjects, busySlots, semesterBusySlots) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Tìm giảng viên và kiểm tra email conflict song song
    const { email, ...restOfLecturerData } = lecturerData;

    const [lecturer, existingAccount] = await Promise.all([
      Lecturer.findByPk(id, {
        include: [{ model: Account, as: "account" }],
        transaction,
      }),
      email ? Account.findOne({
        where: { email, id: { [Op.ne]: null } },
        transaction,
      }) : null
    ]);

    if (!lecturer) {
      await transaction.rollback();
      return null;
    }

    // 2. Kiểm tra email conflict (nếu có thay đổi)
    if (email && email !== lecturer.account.email && existingAccount && existingAccount.id !== lecturer.account.id) {
      throw new Error("Email đã tồn tại.");
    }

    // 3. Kiểm tra các môn học có tồn tại không (nếu có)
    if (subjects && subjects.length > 0) {
      const existingSubjects = await Subject.findAll({
        where: {
          subject_id: {
            [Op.in]: subjects
          }
        },
        attributes: ['subject_id'],
        transaction
      });

      const existingSubjectIds = existingSubjects.map(s => s.subject_id);
      const invalidSubjectIds = subjects.filter(id => !existingSubjectIds.includes(id));

      if (invalidSubjectIds.length > 0) {
        throw new Error(`Các môn học không tồn tại: ${invalidSubjectIds.join(', ')}`);
      }
    }

    // 4. Cập nhật email trong account (nếu có thay đổi)
    if (email && email !== lecturer.account.email) {
      await lecturer.account.update({ email }, { transaction });
    }

    // 5. Cập nhật thông tin giảng viên
    await lecturer.update(restOfLecturerData, { transaction });

    // 6. Cập nhật danh sách môn học (nếu có subjects)
    if (subjects !== undefined) {
      // Xóa tất cả các môn học cũ
      await LecturerAssignment.destroy({
        where: { lecturer_id: id },
        transaction,
      });

      // Thêm các môn học mới
      if (subjects.length > 0) {
        const assignments = subjects.map((subjectId) => ({
          lecturer_id: id,
          subject_id: subjectId,
        }));
        await LecturerAssignment.bulkCreate(assignments, { transaction });
      }
    }

    // 7. Cập nhật danh sách busy slots (nếu có busySlots)
    if (busySlots !== undefined) {
      // Xóa tất cả các busy slots cũ
      await BusySlot.destroy({
        where: { lecturer_id: id },
        transaction,
      });

      // Thêm các busy slots mới
      if (busySlots.length > 0) {
        const busySlotsData = busySlots.map((slot) => ({
          lecturer_id: id,
          day: slot.day,
          slot_id: slot.slot_id,
        }));
        await BusySlot.bulkCreate(busySlotsData, { transaction });
      }
    }

    // 8. Cập nhật danh sách semester busy slots
    if (semesterBusySlots !== undefined) {
      // Xóa tất cả các busy slots cũ
      await SemesterBusySlot.destroy({
        where: { lecturer_id: id },
        transaction,
      });

      // Thêm các busy slots mới
      if (semesterBusySlots.length > 0) {
        const semesterBusySlotsData = SemesterBusySlot.map((slot) => ({
          lecturer_id: id,
          date: slot.date,
          slot_id: slot.slot_id,
        }));
        await BusySlot.bulkCreate(semesterBusySlotsData, { transaction });
      }
    }

    await transaction.commit();

    // 8. Trả về đối tượng giảng viên đã cập nhật hoàn chỉnh
    const result = await Lecturer.findByPk(id, {
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
        {
          model: BusySlot,
          as: "busy_slots",
          attributes: ["day", "slot_id"],
        },
        {
          model: SemesterBusySlot,
          as: "semester_busy_slots",
          attributes: ["date", "slot_id"],
        }
      ],
    });

    return result;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    logger.error(`Lỗi trong service khi cập nhật giảng viên với ID ${id}:`, error);
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

        // Xử lý subjects (môn học) - đổi tên từ subjectIds thành subjects
        let subjects = [];
        if (lecturerData.subjects || lecturerData.subjectIds) {
          const subjectData = lecturerData.subjects || lecturerData.subjectIds;
          if (Array.isArray(subjectData)) {
            subjects = subjectData
              .map((id) => id.toString().trim())
              .filter((id) => id);
          } else if (typeof subjectData === "string") {
            // Nếu là chuỗi, tách bằng dấu phẩy
            subjects = subjectData
              .split(",")
              .map((id) => id.trim())
              .filter((id) => id);
          }
        }

        // Xử lý busySlots (khe thời gian bận)
        let busySlots = [];
        if (lecturerData.busySlots || lecturerData.busy_slots) {
          const busySlotData = lecturerData.busySlots || lecturerData.busy_slots;
          if (Array.isArray(busySlotData)) {
            busySlots = busySlotData
              .filter((slot) => slot && slot.day && slot.slot_id)
              .map((slot) => ({
                day: slot.day.toString().trim(),
                slot_id: parseInt(slot.slot_id),
              }));
          }
        }

        // Validate các môn học nếu có
        if (subjects.length > 0) {
          const existingSubjects = await Subject.findAll({
            where: {
              subject_id: {
                [Op.in]: subjects,
              },
            },
            attributes: ["subject_id"],
          });

          const existingSubjectIds = existingSubjects.map((s) => s.subject_id);
          const invalidSubjectIds = subjects.filter(
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

        // Tạo lecturer mới với subjects và busySlots
        const newLecturer = await createLecturerService(
          cleanedData,
          subjects,
          busySlots
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
