import {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    importProgramsFromJSON // Giả định có thể có thêm importProgramsFromExcel nếu bạn muốn nhập từ Excel
} from "../services/programService";
import { APIResponse } from "../utils/APIResponse"; // Sử dụng APIResponse nhất quán
import ExcelUtils from "../utils/ExcelUtils.js"; // Được sử dụng để tạo template Excel

/**
 * @route GET /api/programs/
 * @desc Lấy tất cả các chương trình đào tạo có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllProgramsController = async (req, res) => {
    try {
        const programs = await getAllPrograms();
        return APIResponse(res, 200, programs, "Lấy danh sách chương trình đào tạo thành công.");
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chương trình đào tạo:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi lấy danh sách chương trình đào tạo.");
    }
};

/**
 * @route GET /api/programs/:id
 * @desc Lấy thông tin chi tiết của một chương trình đào tạo bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getProgramByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const program = await getProgramById(id);
        if (!program) {
            return APIResponse(res, 404, null, "Không tìm thấy chương trình đào tạo.");
        }
        return APIResponse(res, 200, program, "Lấy thông tin chương trình đào tạo thành công.");
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin chương trình đào tạo với ID ${id}:`, error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi lấy thông tin chương trình đào tạo.");
    }
};

/**
 * @route POST /api/programs/add
 * @desc Tạo một chương trình đào tạo mới.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu chương trình).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createProgramController = async (req, res) => {
    const programData = req.body;
    try {
        const program = await createProgram(programData);
        return APIResponse(res, 201, program, "Tạo chương trình đào tạo thành công.");
    } catch (error) {
        console.error("Lỗi khi tạo chương trình đào tạo:", error);
        // Có thể thêm logic kiểm tra lỗi cụ thể hơn từ service (ví dụ: duplicate entry)
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi tạo chương trình đào tạo.");
    }
};

/**
 * @route PUT /api/programs/edit/:id
 * @desc Cập nhật thông tin một chương trình đào tạo bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateProgramController = async (req, res) => {
    const { id } = req.params;
    const programData = req.body;
    try {
        const program = await updateProgram(id, programData);
        if (!program) {
            return APIResponse(res, 404, null, "Không tìm thấy chương trình đào tạo để cập nhật.");
        }
        return APIResponse(res, 200, program, "Cập nhật thông tin chương trình đào tạo thành công.");
    } catch (error) {
        console.error(`Lỗi khi cập nhật chương trình đào tạo với ID ${id}:`, error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi cập nhật thông tin chương trình đào tạo.");
    }
};

/**
 * @route DELETE /api/programs/delete/:id
 * @desc Xóa một chương trình đào tạo bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteProgramController = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCount = await deleteProgram(id); // Giả định service trả về số lượng bản ghi bị xóa
        if (deletedCount === 0) {
            return APIResponse(res, 404, null, "Không tìm thấy chương trình đào tạo để xóa.");
        }
        return APIResponse(res, 200, null, "Xóa chương trình đào tạo thành công.");
    } catch (error) {
        console.error(`Lỗi khi xóa chương trình đào tạo với ID ${id}:`, error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi xóa chương trình đào tạo.");
    }
};

/**
 * @route POST /api/programs/importJson
 * @desc Nhập dữ liệu chương trình đào tạo từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.programs` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importProgramsFromJSONController = async (req, res) => {
    const { programs } = req.body;
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!programs || !Array.isArray(programs)) {
            return APIResponse(res, 400, null, "Dữ liệu chương trình đào tạo không hợp lệ. Yêu cầu một mảng JSON.");
        }

        if (programs.length === 0) {
            return APIResponse(res, 400, null, "Không có dữ liệu chương trình đào tạo nào được cung cấp để import.");
        }

        // Tiến hành import dữ liệu từ JSON
        const results = await importProgramsFromJSON(programs);

        const responseData = {
            success: true, // Chỉ ra rằng request được xử lý
            imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
            errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
            message: `Đã thêm thành công ${results.success.length} chương trình đào tạo.`
        };

        if (results.errors.length > 0) {
            // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status (để báo hiệu một phần thành công)
            responseData.message = `Thêm hoàn tất với ${results.success.length}/${programs.length} bản ghi thành công.`;
            return APIResponse(res, 207, responseData, responseData.message);
        } else {
            // Nếu không có lỗi, trả về 200 OK
            return APIResponse(res, 200, responseData, responseData.message);
        }
    } catch (error) {
        console.error("Lỗi khi import chương trình đào tạo từ dữ liệu JSON:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi thêm dữ liệu.");
    }
};

/**
 * @route GET /api/programs/template/download
 * @desc Tải xuống template Excel mẫu để nhập dữ liệu chương trình đào tạo.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createProgramTemplate.
        const buffer = ExcelUtils.createProgramTemplate();

        // Thiết lập các headers để trình duyệt tải xuống file
        res.setHeader('Content-Disposition', 'attachment; filename=chuong_trinh_dao_tao_mau.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length); // Đặt Content-Length

        // Gửi buffer làm phản hồi
        return res.send(buffer);

    } catch (error) {
        console.error("Lỗi khi tạo và tải xuống template chương trình đào tạo:", error);
        return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
    }
};