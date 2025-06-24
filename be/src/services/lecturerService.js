import db from "../models";
import ExcelUtils from "../utils/ExcelUtils.js";
const { Lecturer } = db;

// get all lecturers
export const getAllLecturers = async () => {
    try {
        const lecturers = await Lecturer.findAll();
        return lecturers;
    } catch (error) {
        console.error("Error getting lecturers:", error);
        throw error;
    }
};

// get a lecturer by id (detail)
export const getLecturerById = async (id) => {
    try {
        const lecturer = await Lecturer.findByPk(id);
        return lecturer;
    } catch (error) {
        console.error(`Error getting lecturer with id ${id}:`, error);
        throw error;
    }
};

// create a new lecturer
export const createLecturer = async (lecturerData) => {
    try {
        const lecturer = await Lecturer.create(lecturerData);
        return lecturer;
    } catch (error) {
        console.error("Error creating lecturer:", error);
        throw error;
    }
};

// update a lecturer by id
export const updateLecturer = async (id, lecturerData) => {
    try {
        const lecturer = await Lecturer.findByPk(id);
        if (!lecturer) {
            throw new Error(`Lecturer with id ${id} not found`);
        }
        await lecturer.update(lecturerData);
        return lecturer;
    } catch (error) {
        console.error(`Error updating lecturer with id ${id}:`, error);
        throw error;
    }
};

// delete a lecturer by id
export const deleteLecturer = async (id) => {
    try {
        const lecturer = await Lecturer.findByPk(id);
        if (!lecturer) {
            throw new Error(`Lecturer with id ${id} not found`);
        }
        await lecturer.destroy();
        return { message: "Lecturer deleted successfully" };
    } catch (error) {
        console.error(`Error deleting lecturer with id ${id}:`, error);
        throw error;
    }
};

// Import lecturers from Excel file
export const importLecturersFromExcel = async (fileBuffer) => {
    try {
        // Đọc file Excel từ buffer
        const rawData = ExcelUtils.readExcelToJSON(fileBuffer);
        
        if (!rawData || rawData.length === 0) {
            throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
        }

        // Chuyển đổi cột tiếng Việt sang tiếng Anh
        const lecturersData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

        const results = {
            success: [],
            errors: [],
            total: lecturersData.length
        };

        // Validate và tạo lecturer cho từng row
        for (let i = 0; i < lecturersData.length; i++) {
            const row = lecturersData[i];
            const rowIndex = i + 2; // Bắt đầu từ row 2 (sau header)

            try {
                // Validate required fields
                if (!row.lecturer_id || !row.name) {
                    results.errors.push({
                        row: rowIndex,
                        lecturer_id: row.lecturer_id || 'N/A',
                        error: 'Mã giảng viên và Họ tên là bắt buộc'
                    });
                    continue;
                }

                // Format data theo structure của database
                const lecturerData = {
                    lecturer_id: ExcelUtils.cleanString(row.lecturer_id),
                    name: ExcelUtils.cleanString(row.name),
                    email: ExcelUtils.cleanString(row.email),
                    day_of_birth: ExcelUtils.formatExcelDate(row.day_of_birth),
                    gender: ExcelUtils.cleanString(row.gender),
                    address: ExcelUtils.cleanString(row.address),
                    phone_number: ExcelUtils.cleanString(row.phone_number),
                    department: ExcelUtils.cleanString(row.department),
                    hire_date: ExcelUtils.formatExcelDate(row.hire_date),
                    degree: ExcelUtils.cleanString(row.degree),
                    status: ExcelUtils.cleanString(row.status) || 'active'
                };

                // Validate email format nếu có
                if (lecturerData.email && !ExcelUtils.isValidEmail(lecturerData.email)) {
                    results.errors.push({
                        row: rowIndex,
                        lecturer_id: lecturerData.lecturer_id,
                        error: 'Email không đúng định dạng'
                    });
                    continue;
                }

                // Kiểm tra lecturer_id đã tồn tại chưa
                const existingLecturer = await Lecturer.findByPk(lecturerData.lecturer_id);
                if (existingLecturer) {
                    results.errors.push({
                        row: rowIndex,
                        lecturer_id: lecturerData.lecturer_id,
                        error: 'Mã giảng viên đã tồn tại'
                    });
                    continue;
                }

                // Kiểm tra email đã tồn tại chưa (nếu có)
                if (lecturerData.email) {
                    const existingEmail = await Lecturer.findOne({ 
                        where: { email: lecturerData.email } 
                    });
                    if (existingEmail) {
                        results.errors.push({
                            row: rowIndex,
                            lecturer_id: lecturerData.lecturer_id,
                            error: 'Email đã tồn tại'
                        });
                        continue;
                    }
                }

                // Tạo lecturer mới
                const newLecturer = await Lecturer.create(lecturerData);
                results.success.push({
                    row: rowIndex,
                    lecturer_id: newLecturer.lecturer_id,
                    name: newLecturer.name
                });

            } catch (error) {
                results.errors.push({
                    row: rowIndex,
                    lecturer_id: row.lecturer_id || 'N/A',
                    error: error.message || 'Lỗi không xác định'
                });
            }
        }

        return results;
    } catch (error) {
        console.error("Error importing lecturers from Excel:", error);
        throw error;
    }
};

// Validate Excel template structure
export const validateExcelTemplate = (fileBuffer) => {    const requiredColumns = ['Mã giảng viên', 'Họ tên'];
    const optionalColumns = ['Email', 'Ngày sinh', 'Giới tính', 'Địa chỉ', 'Số điện thoại', 'Khoa/Bộ môn', 'Ngày tuyển dụng', 'Học vị', 'Trạng thái'];
      const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);
    
    if (!validation.valid) {
        throw new Error(validation.error);
    }
    
    return validation;
};