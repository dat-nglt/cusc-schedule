import {
  getAllSemesterService,
  getSemesterByIdService,
  createSemesterService,
  updateSemesterService,
  deleteSemesterService,
  importSemestersFromJSONService, // Giả định có thể có thêm importSemestersFromExcel nếu bạn muốn nhập từ Excel
} from "../services/semesterService.js";
import { APIResponse } from "../utils/APIResponse.js"; // Sử dụng APIResponse nhất quán
import ExcelUtils from "../utils/ExcelUtils.js"; // Được sử dụng để tạo template Excel

/**
 * @route GET /api/semesters/
 * @desc Lấy tất cả các học kỳ có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllSemestersController = async (req, res) => {
  try {
    const semesters = await getAllSemesterService();
    return APIResponse(res, 200, semesters, "Lấy danh sách học kỳ thành công.");
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học kỳ:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi lấy danh sách học kỳ."
    );
  }
};

/**
 * @route GET /api/semesters/:id
 * @desc Lấy thông tin chi tiết của một học kỳ bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getSemesterByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const semester = await getSemesterByIdService(id);
    if (!semester) {
      return APIResponse(res, 404, null, "Không tìm thấy học kỳ.");
    }
    return APIResponse(res, 200, semester, "Lấy thông tin học kỳ thành công.");
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin học kỳ với ID ${id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi lấy thông tin học kỳ."
    );
  }
};

/**
 * @route POST /api/semesters/add
 * @desc Tạo một học kỳ mới.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu học kỳ).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createSemesterController = async (req, res) => {
  const semesterData = req.body;
  try {
    const semester = await createSemesterService(semesterData);
    return APIResponse(res, 201, semester, "Tạo học kỳ thành công.");
  } catch (error) {
    console.error("Lỗi khi tạo học kỳ:", error);
    // Có thể thêm logic kiểm tra lỗi cụ thể hơn từ service (ví dụ: duplicate entry)
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi tạo học kỳ."
    );
  }
};

/**
 * @route PUT /api/semesters/edit/:id
 * @desc Cập nhật thông tin một học kỳ bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateSemesterController = async (req, res) => {
  const { id } = req.params;
  const semesterData = req.body;
  try {
    const semester = await updateSemesterService(id, semesterData);
    if (!semester) {
      return APIResponse(res, 404, null, "Không tìm thấy học kỳ để cập nhật.");
    }
    return APIResponse(
      res,
      200,
      semester,
      "Cập nhật thông tin học kỳ thành công."
    );
  } catch (error) {
    console.error(`Lỗi khi cập nhật học kỳ với ID ${id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi cập nhật thông tin học kỳ."
    );
  }
};

/**
 * @route DELETE /api/semesters/delete/:id
 * @desc Xóa một học kỳ bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteSemesterController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await deleteSemesterService(id); // Giả định service trả về số lượng bản ghi bị xóa
    if (deletedCount === 0) {
      return APIResponse(res, 404, null, "Không tìm thấy học kỳ để xóa.");
    }
    return APIResponse(res, 200, null, "Xóa học kỳ thành công.");
  } catch (error) {
    console.error(`Lỗi khi xóa học kỳ với ID ${id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi xóa học kỳ."
    );
  }
};

/**
 * @route POST /api/semesters/importJson
 * @desc Nhập dữ liệu học kỳ từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.semesters` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importSemestersFromJSONController = async (req, res) => {
  const { semesters } = req.body;
  try {
    // Kiểm tra dữ liệu đầu vào
    if (!semesters || !Array.isArray(semesters)) {
      return APIResponse(
        res,
        400,
        null,
        "Dữ liệu học kỳ không hợp lệ. Yêu cầu một mảng JSON."
      );
    }

    if (semesters.length === 0) {
      return APIResponse(
        res,
        400,
        null,
        "Không có dữ liệu học kỳ nào được cung cấp để import."
      );
    }

    // Tiến hành import dữ liệu từ JSON
    const results = await importSemestersFromJSONService(semesters);

    const responseData = {
      success: true, // Chỉ ra rằng request được xử lý
      imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
      errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
      message: `Đã thêm thành công ${results.success.length} học kỳ.`,
    };

    if (results.errors.length > 0) {
      // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status (để báo hiệu một phần thành công)
      responseData.message = `Thêm hoàn tất với ${results.success.length}/${semesters.length} bản ghi thành công.`;
      return APIResponse(res, 207, responseData, responseData.message);
    } else {
      // Nếu không có lỗi, trả về 200 OK
      return APIResponse(res, 200, responseData, responseData.message);
    }
  } catch (error) {
    console.error("Lỗi khi import học kỳ từ dữ liệu JSON:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi thêm dữ liệu."
    );
  }
};

/**
 * @route GET /api/semesters/template/download
 * @desc Tải xuống template Excel mẫu để nhập dữ liệu học kỳ.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
  try {
    // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createSemesterTemplate.
    const buffer = ExcelUtils.createSemesterTemplate();

    // Thiết lập các headers để trình duyệt tải xuống file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=hoc_ky_mau.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Length", buffer.length); // Đặt Content-Length

    // Gửi buffer làm phản hồi
    return res.send(buffer);
  } catch (error) {
    console.error("Lỗi khi tạo và tải xuống template học kỳ:", error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
  }
};
