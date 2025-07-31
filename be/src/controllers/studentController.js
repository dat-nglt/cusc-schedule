import {
    getAllStudentService,
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
        const students = await getAllStudentService(); // Đổi tên biến từ 'Students' thành 'students' để nhất quán
        return APIResponse(res, 200, students, "Lấy danh sách học viên thành công.");
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học viên:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi lấy danh sách học viên.");
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
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi lấy thông tin học viên.");
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
    const studentData = req.body; // Đổi tên biến từ 'StudentData' thành 'studentData' để nhất quán
    try {
        const student = await createStudentService(studentData); // Đổi tên biến từ 'Student' thành 'student' để nhất quán
        return APIResponse(res, 201, student, "Tạo học viên thành công.");
    } catch (error) {
        console.error("Lỗi khi tạo học viên:", error);
        // Có thể thêm logic kiểm tra lỗi cụ thể hơn từ service (ví dụ: duplicate entry)
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi tạo học viên.");
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
    const studentData = req.body; // Đổi tên biến từ 'StudentData' thành 'studentData' để nhất quán
    try {
        const student = await updateStudentService(id, studentData); // Đổi tên biến từ 'Student' thành 'student' để nhất quán
        if (!student) {
            return APIResponse(res, 404, null, "Không tìm thấy học viên để cập nhật.");
        }
        return APIResponse(res, 200, student, "Cập nhật thông tin học viên thành công.");
    } catch (error) {
        console.error(`Lỗi khi cập nhật học viên với ID ${id}:`, error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi cập nhật thông tin học viên.");
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
        const deletedCount = await deleteStudentService(id); // Giả định service trả về số lượng bản ghi bị xóa
        if (deletedCount === 0) {
            return APIResponse(res, 404, null, "Không tìm thấy học viên để xóa.");
        }
        return APIResponse(res, 200, null, "Xóa học viên thành công.");
    } catch (error) {
        console.error(`Lỗi khi xóa học viên với ID ${id}:`, error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi xóa học viên.");
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
    try {
        const { students } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!students || !Array.isArray(students)) {
            return APIResponse(res, 400, null, "Dữ liệu học viên không hợp lệ. Yêu cầu một mảng JSON.");
        }

        if (students.length === 0) {
            return APIResponse(res, 400, null, "Không có học viên nào để import.");
        }

        // Tiến hành import dữ liệu từ JSON
        const results = await importStudentsFromJSONService(students); // Đảm bảo tên hàm đúng: importStudentsFromJSON

        const responseData = {
            success: true, // Chỉ ra rằng request được xử lý
            imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
            errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
            message: `Đã thêm thành công ${results.success.length} học viên.`
        };

        if (results.errors.length > 0) {
            // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status (để báo hiệu một phần thành công)
            responseData.message = `Thêm hoàn tất với ${results.success.length}/${students.length} bản ghi thành công.`;
            return APIResponse(res, 207, responseData, responseData.message);
        } else {
            // Nếu không có lỗi, trả về 200 OK
            return APIResponse(res, 200, responseData, responseData.message);
        }

    } catch (error) {
        console.error("Lỗi khi import học viên từ dữ liệu JSON:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi trong quá trình import dữ liệu.");
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
        res.setHeader('Content-Disposition', 'attachment; filename=hoc_vien_mau.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length); // Đặt Content-Length

        // Gửi buffer làm phản hồi
        return res.send(buffer);

    } catch (error) {
        console.error("Lỗi khi tạo và tải xuống template học viên:", error);
        return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
    }
};