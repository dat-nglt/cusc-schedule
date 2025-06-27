import db from "../models";
import ExcelUtils from "../utils/ExcelUtils.js";
const { Student } = db;

// get all students
export const getAllStudents = async () => {
    try {
        const students = await Student.findAll();
        return students;
    } catch (error) {
        console.error("Error getting students:", error);
        throw error;
    }
};

// get a Student by id (detail)
export const getStudentById = async (id) => {
    try {
        const student = await Student.findByPk(id);
        return student;
    } catch (error) {
        console.error(`Error getting Student with id ${id}:`, error);
        throw error;
    }
};

// create a new Student
export const createStudent = async (StudentData) => {
    try {
        const student = await Student.create(StudentData);
        return student;
    } catch (error) {
        console.error("Error creating Student:", error);
        throw error;
    }
};

// update a Student by id
export const updateStudent = async (id, StudentData) => {
    try {
        const student = await Student.findByPk(id);
        if (!student) {
            throw new Error(`Student with id ${id} not found`);
        }
        await student.update(StudentData);
        return student;
    } catch (error) {
        console.error(`Error updating Student with id ${id}:`, error);
        throw error;
    }
};

// delete a Student by id
export const deleteStudent = async (id) => {
    try {
        const student = await Student.findByPk(id);
        if (!Student) {
            throw new Error(`Student with id ${id} not found`);
        }
        await student.destroy();
        return { message: "Student deleted successfully" };
    } catch (error) {
        console.error(`Error deleting Student with id ${id}:`, error);
        throw error;
    }
};

// Import students from Excel file
export const importstudentsFromExcel = async (fileBuffer) => {
    try {
        // Đọc file Excel từ buffer
        const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

        if (!rawData || rawData.length === 0) {
            throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
        }

        // Chuyển đổi cột tiếng Việt sang tiếng Anh
        const studentsData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

        const results = {
            success: [],
            errors: [],
            total: studentsData.length
        };

        // Validate và tạo Student cho từng row
        for (let i = 0; i < studentsData.length; i++) {
            const row = studentsData[i];
            const rowIndex = i + 2; // Bắt đầu từ row 2 (sau header)

            try {
                // Validate required fields
                if (!row.student_id || !row.name) {
                    results.errors.push({
                        row: rowIndex,
                        student_id: row.student_id || 'N/A',
                        error: 'Mã học viên và Họ tên là bắt buộc'
                    });
                    continue;
                }

                // Format data theo structure của database
                const studentData = {
                    student_id: ExcelUtils.cleanString(row.student_id),
                    name: ExcelUtils.cleanString(row.name),
                    email: ExcelUtils.cleanString(row.email),
                    day_of_birth: ExcelUtils.formatExcelDate(row.day_of_birth),
                    gender: ExcelUtils.cleanString(row.gender),
                    address: ExcelUtils.cleanString(row.address),
                    phone_number: ExcelUtils.cleanString(row.phone_number),
                    class: ExcelUtils.cleanString(row.class),
                    admission_year: ExcelUtils.cleanString(row.admission_year),
                    gpa: ExcelUtils.cleanString(row.gpa),
                    status: ExcelUtils.cleanString(row.status)
                };

                // Validate email format nếu có
                if (studentData.email && !ExcelUtils.isValidEmail(studentData.email)) {
                    results.errors.push({
                        row: rowIndex,
                        student_id: studentData.student_id,
                        error: 'Email không đúng định dạng'
                    });
                    continue;
                }

                // Kiểm tra Student_id đã tồn tại chưa
                const existingStudent = await Student.findByPk(studentData.student_id);
                if (existingStudent) {
                    results.errors.push({
                        row: rowIndex,
                        student_id: studentData.student_id,
                        error: 'Mã học viên đã tồn tại'
                    });
                    continue;
                }

                // Kiểm tra email đã tồn tại chưa (nếu có)
                if (studentData.email) {
                    const existingEmail = await Student.findOne({
                        where: { email: studentData.email }
                    });
                    if (existingEmail) {
                        results.errors.push({
                            row: rowIndex,
                            student_id: studentData.student_id,
                            error: 'Email đã tồn tại'
                        });
                        continue;
                    }
                }

                // Tạo Student mới
                const newStudent = await Student.create(studentData);
                results.success.push({
                    row: rowIndex,
                    student_id: newStudent.student_id,
                    name: newStudent.name
                });

            } catch (error) {
                results.errors.push({
                    row: rowIndex,
                    student_id: row.student_id || 'N/A',
                    error: error.message || 'Lỗi không xác định'
                });
            }
        }

        return results;
    } catch (error) {
        console.error("Error importing students from Excel:", error);
        throw error;
    }
};

// Validate Excel template structure
export const validateExcelTemplate = (fileBuffer) => {
    const requiredColumns = ['Mã học viên', 'Họ tên'];
    const optionalColumns = ['Email', 'Ngày sinh', 'Giới tính', 'Địa chỉ', 'Số điện thoại', 'Mã lớp', 'Năm nhập học', 'Điểm', 'Trạng thái'];
    const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

    if (!validation.valid) {
        throw new Error(validation.error);
    }

    return validation;
};