import {
  getAllLecturersService,
  getLecturerByIdService,
  createLecturerService,
  updateLecturerService,
  deleteLecturerService,
  importLecturersFromJsonService, // Giả định có thể có thêm importLecturersFromExcel nếu bạn muốn import từ Excel
} from "../services/lecturerService.js";
import { APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js"; // Được sử dụng để tạo template Excel
import logger from "../utils/logger.js";

/**
 * @route GET /api/lecturers/
 * @desc Lấy tất cả danh sách giảng viên trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllLecturersController = async (req, res) => {
  try {
    const lecturers = await getAllLecturersService();
    if (!lecturers.length) {
      return APIResponse(
        res,
        200,
        [],
        "Không có giảng viên nào được tìm thấy."
      );
    }

    return APIResponse(
      res,
      200,
      lecturers,
      "Lấy danh sách giảng viên thành công."
    );
  } catch (error) {
    console.error("Lỗi trong getAllLecturersController:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi máy chủ."
    );
  }
};

/**
 * @route POST /api/lecturers/add
 * @desc Tạo một giảng viên mới.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu giảng viên).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createLecturerController = async (req, res) => {
  const { newLecturerData, newLecturerSubjects, busySlots, semesterBusySlots } =
    req.body;

  if (!newLecturerData) {
    return APIResponse(
      res,
      400,
      null,
      "Dữ liệu giảng viên không được cung cấp."
    );
  }

  const { lecturer_id, email, name } = newLecturerData;

  if (!lecturer_id || !email || !name) {
    return APIResponse(
      res,
      400,
      null,
      "Mã giảng viên, email và tên là các trường bắt buộc."
    );
  }

  try {
    const createdLecturer = await createLecturerService(
      newLecturerData,
      newLecturerSubjects,
      busySlots,
      semesterBusySlots
    );

    return APIResponse(res, 201, createdLecturer, "Tạo giảng viên thành công.");
  } catch (error) {
    console.error("Lỗi khi tạo giảng viên:", error.message);

    // Nếu lỗi do dữ liệu trùng hoặc không tồn tại
    if (
      error.message.includes("đã tồn tại") ||
      error.message.includes("không tồn tại")
    ) {
      return APIResponse(res, 400, null, error.message);
    }

    // Lỗi hệ thống khác
    return APIResponse(
      res,
      500,
      null,
      "Đã xảy ra lỗi hệ thống khi tạo giảng viên."
    );
  }
};

/**
 * @route PUT /api/lecturers/edit/:id
 * @desc Cập nhật thông tin một giảng viên bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateLecturerController = async (req, res) => {
  const { id } = req.params;
  const lecturerData = req.body;
  try {
    const lecturer = await updateLecturerService(id, lecturerData);
    if (!lecturer) {
      return APIResponse(
        res,
        404,
        null,
        "Không tìm thấy giảng viên để cập nhật."
      );
    }
    return APIResponse(
      res,
      200,
      lecturer,
      "Cập nhật thông tin giảng viên thành công."
    );
  } catch (error) {
    console.error(`Lỗi khi cập nhật giảng viên với ID ${id}:`, error.message);
    if (
      error.message.includes("không tìm thấy") ||
      error.message.includes("Email đã tồn tại")
    ) {
      return APIResponse(res, 400, null, error.message);
    }
    return APIResponse(
      res,
      500,
      null,
      "Đã xảy ra lỗi hệ thống khi cập nhật thông tin giảng viên."
    );
  }
};

/**
 * @route DELETE /api/lecturers/delete/:id
 * @desc Xóa một giảng viên bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteLecturerController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await deleteLecturerService(id);

    if (deletedCount === 0) {
      return APIResponse(res, 404, null, "Không tìm thấy giảng viên để xóa.");
    }

    return APIResponse(
      res,
      200,
      null,
      "Xóa giảng viên và tài khoản thành công."
    );
  } catch (error) {
    console.error(`Lỗi khi xóa giảng viên với ID ${id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi xóa giảng viên."
    );
  }
};

/**
 * @route GET /api/lecturers/template/download
 * @desc Tải xuống template Excel mẫu để nhập dữ liệu giảng viên.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
  try {
    // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createLecturerTemplate.
    const buffer = ExcelUtils.createLecturerTemplate();

    // Thiết lập các headers để trình duyệt tải xuống file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=giang_vien_mau.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Length", buffer.length); // Đặt Content-Length

    // Gửi buffer làm phản hồi
    return res.send(buffer);
  } catch (error) {
    console.error("Lỗi khi tạo và tải xuống template giảng viên:", error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
  }
};

/**
 * @route POST /api/lecturers/importJson
 * @desc Nhập dữ liệu giảng viên từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.lecturers` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importLecturersFromJsonController = async (req, res) => {
  try {
    const { lecturers } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!lecturers || !Array.isArray(lecturers)) {
      return APIResponse(
        res,
        400,
        null,
        "Dữ liệu giảng viên không hợp lệ. Yêu cầu một mảng JSON."
      );
    }

    if (lecturers.length === 0) {
      return APIResponse(
        res,
        400,
        null,
        "Không có dữ liệu giảng viên nào được cung cấp để import."
      );
    }

    // Tiến hành import dữ liệu từ JSON
    const results = await importLecturersFromJsonService(lecturers);

    const responseData = {
      success: true, // Chỉ ra rằng request được xử lý
      imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
      errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
      message: `Đã thêm thành công ${results.success.length} giảng viên.`,
    };

    if (results.errors.length > 0) {
      // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status (để báo hiệu một phần thành công)
      responseData.message = `Thêm hoàn tất với ${results.success.length}/${lecturers.length} bản ghi thành công.`;
      return APIResponse(res, 207, responseData, responseData.message);
    } else {
      // Nếu không có lỗi, trả về 200 OK
      return APIResponse(res, 200, responseData, responseData.message);
    }
  } catch (error) {
    console.error("Lỗi khi import giảng viên từ dữ liệu JSON:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi trong quá trình import dữ liệu."
    );
  }
};
