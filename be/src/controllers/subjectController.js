import {
  getAllSubjectsService,
  getSubjectByIdService,
  createSubjectService,
  updateSubjectService,
  deleteSubjectService,
  getSubjectsBySemesterService,
  importSubjectsFromJSONService,
} from "../services/subjectService.js";
import { APIResponse } from "../utils/APIResponse.js"; // Đảm bảo APIResponse được import chính xác và hoạt động như mong đợi
import ExcelUtils from "../utils/ExcelUtils.js"; // Được sử dụng để tạo template Excel

/**
 * @route GET /api/subjects/
 * @desc Lấy tất cả danh sách môn học trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllSubjectsController = async (req, res) => {
  try {
    const subjects = await getAllSubjectsService();
    return APIResponse(res, 200, subjects, "Lấy danh sách môn học thành công.");
  } catch (error) {
    console.error("Lỗi khi lấy danh sách môn học:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi lấy danh sách môn học."
    );
  }
};

/**
 * @route GET /api/subjects/:id
 * @desc Lấy thông tin chi tiết của một môn học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getSubjectByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await getSubjectByIdService(id);
    if (!subject) {
      return APIResponse(res, 404, null, "Không tìm thấy môn học.");
    }
    return APIResponse(res, 200, subject, "Lấy thông tin môn học thành công.");
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin môn học với ID ${id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi lấy thông tin môn học."
    );
  }
};

/**
 * @route POST /api/subjects/add
 * @desc Tạo một môn học mới.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu môn học).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createSubjectController = async (req, res) => {
  const subjectData = req.body;
  try {
    const subject = await createSubjectService(subjectData);
    return APIResponse(res, 201, subject, "Tạo môn học thành công.");
  } catch (error) {
    console.error("Lỗi khi tạo môn học:", error);
    // Có thể thêm logic kiểm tra lỗi cụ thể hơn từ service (ví dụ: duplicate entry)
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi tạo môn học."
    );
  }
};

/**
 * @route PUT /api/subjects/edit/:id
 * @desc Cập nhật thông tin một môn học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateSubjectController = async (req, res) => {
  const { id } = req.params;
  const subjectData = req.body;
  try {
    const subject = await updateSubjectService(id, subjectData);
    if (!subject) {
      return APIResponse(res, 404, null, "Không tìm thấy môn học để cập nhật.");
    }
    return APIResponse(
      res,
      200,
      subject,
      "Cập nhật thông tin môn học thành công."
    );
  } catch (error) {
    console.error(`Lỗi khi cập nhật môn học với ID ${id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi cập nhật môn học."
    );
  }
};

/**
 * @route DELETE /api/subjects/delete/:id
 * @desc Xóa một môn học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteSubjectController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await deleteSubjectService(id); // Giả định service trả về số lượng bản ghi bị xóa
    if (deletedCount === 0) {
      return APIResponse(res, 404, null, "Không tìm thấy môn học để xóa.");
    }
    return APIResponse(res, 200, null, "Xóa môn học thành công.");
  } catch (error) {
    console.error(`Lỗi khi xóa môn học với ID ${id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi xóa môn học."
    );
  }
};

/**
 * @route GET /api/subjects/semester/:semesterId
 * @desc Lấy danh sách môn học thuộc một học kỳ cụ thể.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.semesterId`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer, lecturer, student)
 */
export const getSubjectsBySemesterController = async (req, res) => {
  const { semesterId } = req.params;
  try {
    const subjects = await getSubjectsBySemesterService(semesterId);
    if (!subjects || subjects.length === 0) {
      return APIResponse(
        res,
        404,
        null,
        "Không tìm thấy môn học nào cho học kỳ này."
      );
    }
    return APIResponse(
      res,
      200,
      subjects,
      "Lấy danh sách môn học theo học kỳ thành công."
    );
  } catch (error) {
    console.error(`Lỗi khi lấy môn học cho học kỳ ${semesterId}:`, error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi lấy danh sách môn học theo học kỳ."
    );
  }
};

/**
 * @route POST /api/subjects/importJson
 * @desc Nhập dữ liệu môn học từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.subjects` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importSubjectsFromJSONController = async (req, res) => {
  const { subjects } = req.body;
  try {
    // Kiểm tra dữ liệu đầu vào
    if (!subjects || !Array.isArray(subjects)) {
      return APIResponse(
        res,
        400,
        null,
        "Dữ liệu môn học không hợp lệ. Yêu cầu một mảng JSON."
      );
    }

    if (subjects.length === 0) {
      return APIResponse(
        res,
        400,
        null,
        "Không có môn học nào được cung cấp để import."
      );
    }

    // Tiến hành import dữ liệu từ JSON
    const results = await importSubjectsFromJSONService(subjects);

    const responseData = {
      success: true, // Chỉ ra rằng request được xử lý
      imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
      errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
      message: `Đã thêm thành công ${results.success.length} môn học.`,
    };

    if (results.errors.length > 0) {
      // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status (để báo hiệu một phần thành công)
      responseData.message = `Thêm hoàn tất với ${results.success.length}/${subjects.length} bản ghi thành công.`;
      return APIResponse(res, 207, responseData, responseData.message);
    } else {
      // Nếu không có lỗi, trả về 200 OK
      return APIResponse(res, 200, responseData, responseData.message);
    }
  } catch (error) {
    console.error("Lỗi khi import môn học từ dữ liệu JSON:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi trong quá trình import dữ liệu."
    );
  }
};

/**
 * @route GET /api/subjects/template/download
 * @desc Tải xuống template Excel mẫu để nhập dữ liệu môn học.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
  try {
    // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createSubjectTemplate.
    const buffer = ExcelUtils.createSubjectTemplate();

    // Thiết lập các headers để trình duyệt tải xuống file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=mon_hoc_mau.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Length", buffer.length); // Đặt Content-Length

    // Gửi buffer làm phản hồi
    return res.send(buffer);
  } catch (error) {
    console.error("Lỗi khi tạo và tải xuống template môn học:", error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
  }
};
