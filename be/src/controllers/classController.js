import {
  getAllClassesService,
  validateExcelTemplate,
  getClassByIdService,
  createClassService,
  updateClassService,
  deleteClassService,
  listClassesService,
  importClassesFromExcelService,
  importClassesFromJsonService, // Đổi tên hàm này để rõ ràng hơn nếu validate cho class template
} from "../services/classService.js";
import {
  successResponse,
  errorResponse,
  APIResponse,
} from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import path from "path";

/**
 * @route GET /api/classes/
 * @desc Lấy tất cả các lớp học có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllClassesController = async (req, res) => {
  try {
    const classes = await getAllClassesService();

    if (!classes || classes.length === 0) {
      return APIResponse(res, 200, [], "No classes found.");
    }

    return APIResponse(
      res,
      200,
      classes,
      "Đã lấy thành công danh sách các lớp"
    );
  } catch (error) {
    console.error("Error fetching all classes:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "An error occurred while retrieving all classes."
    );
  }
};

/**
 * @route GET /api/classes/:class_id
 * @desc Lấy thông tin chi tiết một lớp học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.class_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getClassByIdController = async (req, res) => {
  const { class_id } = req.params;
  try {
    const classInstance = await getClassByIdService(class_id);

    if (!classInstance) {
      return APIResponse(res, 404, null, "Class not found.");
    }

    return APIResponse(
      res,
      200,
      classInstance,
      "Class information retrieved successfully."
    );
  } catch (error) {
    console.error(`Error fetching class with ID ${class_id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      "An unexpected error occurred while retrieving class information."
    );
  }
};

/**
 * @route POST /api/classes/add
 * @desc Tạo một lớp học mới. Bao gồm kiểm tra validation cơ bản cho mã và tên lớp.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu lớp học).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createClassController = async (req, res) => {
  const { class_id } = req.body;

  // Validation cơ bản ở controller
  if (!class_id) {
    return APIResponse(res, 400, null, "Mã lớp học là bắt buộc.");
  }

  try {
    const newClass = await createClassService(req.body);
    return APIResponse(res, 201, newClass, "Tạo lớp học thành công.");
  } catch (error) {
    // Xử lý các lỗi cụ thể từ service
    if (
      error.message.includes("đã tồn tại") ||
      error.message.includes("khóa học")
    ) {
      return APIResponse(res, 409, null, error.message); // Conflict
    }
    if (error.message.includes("vượt quá")) {
      return APIResponse(res, 400, null, error.message); // Bad Request
    }

    // Lỗi chung
    console.error("Lỗi khi tạo lớp học:", error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo lớp học.");
  }
};

/**
 * @route PUT /api/classes/edit/:class_id
 * @desc Cập nhật thông tin một lớp học bằng ID. Bao gồm kiểm tra validation cho tên lớp.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.class_id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateClassController = async (req, res) => {
  const { class_id } = req.params;
  const { class_name } = req.body;

  // Validation cơ bản ở controller
  if (class_name && class_name.length > 50) {
    return APIResponse(
      res,
      400,
      null,
      "Tên lớp học không được vượt quá 50 ký tự."
    );
  }

  try {
    const updatedClass = await updateClassService(class_id, req.body);

    if (!updatedClass) {
      return APIResponse(res, 404, null, "Không tìm thấy lớp học để cập nhật.");
    }

    return APIResponse(res, 200, updatedClass, "Cập nhật lớp học thành công.");
  } catch (error) {
    // Xử lý các lỗi cụ thể từ service
    if (error.message.includes("khóa học")) {
      return APIResponse(res, 404, null, error.message); // Not Found
    }

    // Lỗi chung
    console.error(`Lỗi khi cập nhật lớp học với ID ${class_id}:`, error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi cập nhật lớp học.");
  }
};

/**
 * @route DELETE /api/classes/delete/:class_id
 * @desc Xóa một lớp học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.class_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteClassController = async (req, res) => {
  const { class_id } = req.params;
  try {
    const isDeleted = await deleteClassService(class_id);

    if (!isDeleted) {
      return APIResponse(res, 404, null, "Không tìm thấy lớp học để xóa.");
    }

    return APIResponse(res, 200, null, "Xóa lớp học thành công.");
  } catch (error) {
    // Xử lý các lỗi cụ thể từ service
    // Ví dụ: lỗi do ràng buộc khóa ngoại
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return APIResponse(
        res,
        409,
        null,
        "Không thể xóa lớp học vì có sinh viên hoặc dữ liệu liên quan."
      );
    }

    // Lỗi chung
    console.error(`Lỗi khi xóa lớp học với ID ${class_id}:`, error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi xóa lớp học.");
  }
};

/**
 * @route GET /api/classes/list
 * @desc Lấy danh sách các lớp học có áp dụng các bộ lọc từ query parameters.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.query` các bộ lọc).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const listClassesController = async (req, res) => {
  try {
    const { class_id, class_name, status, course_id } = req.query;

    const filters = {
      ...(class_id && { class_id }),
      ...(class_name && { class_name }),
      ...(status && { status }),
      ...(course_id && { course_id }),
    };

    const classes = await listClassesService(filters);

    if (!classes || classes.length === 0) {
      return APIResponse(res, 200, [], "Không tìm thấy lớp học nào.");
    }

    return APIResponse(res, 200, classes, "Lấy danh sách lớp học thành công.");
  } catch (error) {
    console.error("Lỗi khi liệt kê lớp học:", error);
    return APIResponse(
      res,
      500,
      null,
      "Đã xảy ra lỗi khi liệt kê danh sách lớp học."
    );
  }
};

/**
 * @route POST /api/classes/import
 * @desc Nhập dữ liệu lớp học từ file Excel được tải lên.
 * Thực hiện validate file, validate template và sau đó import dữ liệu.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.file` từ Multer).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importClassesController = async (req, res) => {
  try {
    if (!req.file) {
      return APIResponse(res, 400, null, 'Vui lòng chọn file Excel để import.');
    }

    const fileBuffer = req.file.buffer;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = ['.xlsx', '.xls'];

    if (!allowedExtensions.includes(fileExtension)) {
      return APIResponse(res, 400, null, 'Chỉ chấp nhận file Excel (.xlsx, .xls).');
    }

    const templateValidation = validateExcelTemplate(fileBuffer);
    if (!templateValidation.valid) {
      return APIResponse(res, 400, null, templateValidation.error || 'Cấu trúc template không hợp lệ. Vui lòng sử dụng template mẫu.');
    }

    const results = await importClassesFromExcelService(fileBuffer);
    const { total, success, errors } = results;

    const responseData = {
      summary: { total, success: success.length, errors: errors.length },
      successRecords: success,
      errorRecords: errors,
    };

    if (errors.length > 0) {
      const message = `Import hoàn tất với ${success.length}/${total} bản ghi thành công.`;
      return APIResponse(res, 207, responseData, message);
    } else {
      const message = `Import thành công ${success.length} lớp học.`;
      return APIResponse(res, 200, responseData, message);
    }
  } catch (error) {
    console.error('Lỗi khi import lớp học từ file Excel:', error);
    return APIResponse(res, 500, null, error.message || 'Đã xảy ra lỗi trong quá trình import file Excel.');
  }
};

/**
 * @route GET /api/classes/template/download
 * @desc Tải xuống template Excel mẫu cho lớp học.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
  try {
    // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createClassTemplate.
    const buffer = ExcelUtils.createClassTemplate();

    // Thiết lập các headers để trình duyệt tải xuống file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=lop_hoc_mau.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Length", buffer.length); // Đặt Content-Length

    // Gửi buffer làm phản hồi
    return res.send(buffer);
  } catch (error) {
    console.error("Lỗi khi tạo và tải xuống template lớp học:", error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
  }
};

/**
 * @route POST /api/classes/importJson
 * @desc Nhập dữ liệu lớp học từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.classes` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importClassesFromJsonController = async (req, res) => {
  try {
    const { classes } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!classes || !Array.isArray(classes)) {
      return APIResponse(
        res,
        400,
        null,
        "Dữ liệu lớp học không hợp lệ. Yêu cầu một mảng JSON."
      );
    }

    if (classes.length === 0) {
      return APIResponse(
        res,
        400,
        null,
        "Không có dữ liệu lớp học nào được cung cấp để import."
      );
    }

    // Tiến hành import dữ liệu từ JSON
    const results = await importClassesFromJsonService(classes);

    const responseData = {
      success: true, // Chỉ ra rằng request được xử lý
      imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
      errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
      message: `Import thành công ${results.success.length} lớp học.`,
    };

    if (results.errors.length > 0) {
      // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status
      responseData.message = `Import hoàn tất với ${results.success.length}/${classes.length} bản ghi thành công.`;
      return APIResponse(res, 207, responseData, responseData.message);
    } else {
      // Nếu không có lỗi, trả về 200 OK
      return APIResponse(res, 200, responseData, responseData.message);
    }
  } catch (error) {
    console.error("Lỗi khi import lớp học từ dữ liệu JSON:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi trong quá trình import dữ liệu."
    );
  }
};
