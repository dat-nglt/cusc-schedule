import {
  getAllStudentsService,
  getStudentByIdService,
  createStudentService,
  updateStudentService,
  importStudentsFromJSONService, // Đảm bảo tên hàm này đúng trong service
  deleteStudentService,
} from "../services/studentService.js";
import { APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js"; // Được sử dụng để tạo template Excel

/**
 * @route GET /api/students/
 * @desc Lấy tất cả danh sách học viên trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllStudentsController = async (req, res) => {
  try {
    const students = await getAllStudentsService();
    if (!students) {
      return APIResponse(res, 200, [], "No students found.");
    }
    return APIResponse(res, 200, students, "Successfully retrieved students.");
  } catch (error) {
    console.error("Không thể tải danh sách học viên");
    return APIResponse(
      res,
      500,
      null,
      error.message || "Không thể tải danh sách học viên"
    );
  }
};

/**
 * @route GET /api/students/:id
 * @desc Lấy thông tin chi tiết của một học viên bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getStudentByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await getStudentByIdService(id); // Đổi tên biến từ 'Student' thành 'student' để nhất quán
    if (!student) {
      return APIResponse(res, 404, null, "Không tìm thấy học viên.");
    }
    return APIResponse(res, 200, student, "Lấy thông tin học viên thành công.");
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin học viên với ID ${id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi lấy thông tin học viên."
    );
  }
};

/**
 * @route POST /api/students/add
 * @desc Tạo một học viên mới.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu học viên).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createStudentController = async (req, res) => {
  const studentData = req.body;
  try {
    const newStudent = await createStudentService(studentData);
    return APIResponse(res, 201, newStudent, "Student created successfully.");
  } catch (error) {
    if (
      error.message.includes("Mã học viên") ||
      error.message.includes("Email")
    ) {
      return APIResponse(res, 409, null, error.message); // Conflict
    }
    // Lỗi chung
    console.error("Error creating student:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "An error occurred while creating the student."
    );
  }
};

/**
 * @route PUT /api/students/edit/:id
 * @desc Cập nhật thông tin một học viên bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateStudentController = async (req, res) => {
  const { id } = req.params;
  const studentData = req.body;
  try {
    const updatedStudent = await updateStudentService(id, studentData);
    if (!updatedStudent) {
      return APIResponse(res, 404, null, "Không tìm thấy thông tin học vieneF");
    }

    return APIResponse(
      res,
      200,
      updatedStudent,
      "Cập nhật thông tin học viên thành công"
    );
  } catch (error) {
    if (error.message.includes("Email")) {
      return APIResponse(res, 409, null, error.message); // Conflict
    }

    console.error(`Lỗi khi thực hiện cập nhật Học viên ${id}:`, error.message);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Xảy ra lỗi trong quá trình cập nhật thông tin học viên"
    );
  }
};

/**
 * @route DELETE /api/students/delete/:id
 * @desc Xóa một học viên bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteStudentController = async (req, res) => {
  const { id } = req.params;
  try {
    const isDeleted = await deleteStudentService(id);

    if (!isDeleted) {
      return APIResponse(res, 404, null, "Không tìm thấy thông tin học viên");
    }

    return APIResponse(res, 200, null, "Xoá học viên thành công");
  } catch (error) {
    console.error(`Lỗi trong quá trình xoá học viên ${id}:`, error.message);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Lỗi trong quá trình xoá học viên"
    );
  }
};

/**
 * @route POST /api/students/importJson
 * @desc Nhập dữ liệu học viên từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.students` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importStudentsFromJSONController = async (req, res) => {
  const { students } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!students || !Array.isArray(students) || students.length === 0) {
    return APIResponse(
      res,
      400,
      null,
      "Invalid or empty student data. An array of students is required."
    );
  }

  try {
    const results = await importStudentsFromJSONService(students);

    const { success, errors } = results;
    const totalRecords = students.length;

    const responseData = {
      imported: success,
      errors,
      total: totalRecords,
      successCount: success.length,
      errorCount: errors.length,
    };

    if (errors.length > 0) {
      const message = `Import completed with ${success.length}/${totalRecords} successful records.`;
      return APIResponse(res, 207, responseData, message); // Multi-Status
    } else {
      const message = `Successfully imported all ${totalRecords} students.`;
      return APIResponse(res, 200, responseData, message); // OK
    }
  } catch (error) {
    console.error("Error importing students from JSON:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "An error occurred during the import process."
    );
  }
};

/**
 * @route GET /api/students/template/download
 * @desc Tải xuống template Excel mẫu để nhập dữ liệu học viên.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
  try {
    // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createStudentTemplate.
    const buffer = ExcelUtils.createStudentTemplate();

    // Thiết lập các headers để trình duyệt tải xuống file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=hoc_vien_mau.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Length", buffer.length); // Đặt Content-Length

    // Gửi buffer làm phản hồi
    return res.send(buffer);
  } catch (error) {
    console.error("Lỗi khi tạo và tải xuống template học viên:", error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
  }
};
