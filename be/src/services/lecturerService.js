import db from "../models/User.js";
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


// Import lecturers from JSON data (for preview feature)
export const importLecturersFromJson = async (lecturersData) => {
    try {
        if (!lecturersData || !Array.isArray(lecturersData)) {
            throw new Error("Dữ liệu giảng viên không hợp lệ");
        }

        const results = {
            success: [],
            errors: [],
            total: lecturersData.length
        };

        // Validate và tạo lecturer cho từng item
        for (let i = 0; i < lecturersData.length; i++) {
            const lecturerData = lecturersData[i];
            const index = i + 1;

            try {
                // Validate required fields
                if (!lecturerData.lecturer_id || !lecturerData.name || !lecturerData.email) {
                    results.errors.push({
                        index: index,
                        lecturer_id: lecturerData.lecturer_id || 'N/A',
                        error: 'Mã giảng viên, họ tên và email là bắt buộc'
                    });
                    continue;
                }

                // Clean và format data
               const cleanedData = {
                    lecturer_id: lecturerData.lecturer_id.toString().trim(),
                    name: lecturerData.name.toString().trim(),
                    email: lecturerData.email ? lecturerData.email.toString().trim() : null,
                    day_of_birth: lecturerData.day_of_birth || null,
                    gender: lecturerData.gender ? lecturerData.gender.toString().trim() : null,
                    address: lecturerData.address ? lecturerData.address.toString().trim() : null,
                    phone_number: lecturerData.phone_number ? lecturerData.phone_number.toString().trim() : null,
                    department: lecturerData.department ? lecturerData.department.toString().trim() : null,
                    hire_date: lecturerData.hire_date || null,
                    degree: lecturerData.degree ? lecturerData.degree.toString().trim() : null,
                    status: lecturerData.status || 'Hoạt động'
                };

                // Validate email format nếu có
                if (cleanedData.email && !ExcelUtils.isValidEmail(cleanedData.email)) {
                    results.errors.push({
                        index: index,
                        lecturer_id: cleanedData.lecturer_id,
                        error: 'Email không đúng định dạng'
                    });
                    continue;
                }

                // Kiểm tra lecturer_id đã tồn tại chưa
                const existingLecturer = await Lecturer.findOne({
                    where: { lecturer_id: cleanedData.lecturer_id }
                });
                if (existingLecturer) {
                    results.errors.push({
                        index: index,
                        lecturer_id: cleanedData.lecturer_id,
                        error: 'Mã giảng viên đã tồn tại'
                    });
                    continue;
                }

                // Kiểm tra email đã tồn tại chưa (nếu có)
                if (cleanedData.email) {
                    const existingEmail = await Lecturer.findOne({
                        where: { email: cleanedData.email }
                    });
                    if (existingEmail) {
                        results.errors.push({
                            index: index,
                            lecturer_id: cleanedData.lecturer_id,
                             error: 'Email đã tồn tại'
                        });
                        continue;
                    }
                }

                // Tạo lecturer mới
                const newLecturer = await Lecturer.create(cleanedData);
                results.success.push(newLecturer);

            } catch (error) {
                results.errors.push({
                    index: index,
                    lecturer_id: lecturerData.lecturer_id || 'N/A',
                    error: error.message || 'Lỗi không xác định'
                });
            }
        }

        return results;
    } catch (error) {
        console.error("Error importing lecturers from JSON:", error);
        throw error;
    }
};

// Validate Excel template structure
export const validateExcelTemplate = (fileBuffer) => {
    const requiredColumns = ['Mã giảng viên', 'Họ tên'];
    const optionalColumns = ['Email', 'Ngày sinh', 'Giới tính', 'Địa chỉ', 'Số điện thoại', 'Khoa/Bộ môn', 'Ngày tuyển dụng', 'Học vị', 'Trạng thái'];
    const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

    if (!validation.valid) {
        throw new Error(validation.error);
    }

    return validation;
};