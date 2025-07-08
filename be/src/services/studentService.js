import { Student } from "../models/index.js";
import ExcelUtils from "../utils/ExcelUtils.js";

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
        if (!student) {
            throw new Error(`Student with id ${id} not found`);
        }
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

//import student from JSON data (preview feature)
export const importstudentsFromJSON = async (studentsData) => {
    try {
        if (!studentsData || !Array.isArray(studentsData)) {
            throw new Error("Dữ liệu giảng viên không hợp lệ");
        }

        const results = {
            success: [],
            errors: [],
            total: studentsData.length
        };

        //validate and create student for each item
        for (let i = 0; i < studentsData.length; i++) {
            const studentData = studentsData[i];
            const index = i + 1;

            try {
                //validate required fields
                if (!studentData.student_id) {
                    results.errors.push({
                        index: index,
                        student_id: studentData.student_id || 'N/A',
                        error: 'Mã học viên là bắt buộc'
                    });
                    continue;
                }
                if (!studentData.email) {
                    results.errors.push({
                        index: index,
                        student_id: studentData.student_id || 'N/A',
                        error: 'email là bắt buộc'
                    });
                    continue;
                }

                // clean and format data (chuyển sang kiểu chuỗi và xóa khoảng cách thừa ở đầu chuỗi và cuối chuỗi)
                const cleanedData = {
                    student_id: studentData.student_id.toString().trim(),
                    name: studentData.name.toString().trim(),
                    email: studentData.email.toString().trim(),
                    day_of_birth: studentData.day_of_birth || null,
                    gender: studentData.gender ? studentData.gender.toString().trim() : null,
                    address: studentData.address ? studentData.address.toString().trim() : null,
                    phone_number: studentData.phone_number ? studentData.phone_number.toString().trim() : null,
                    class: studentData.class ? studentData.class.toString().trim() : null,
                    admission_year: studentData.admission_year || null,
                    gpa: studentData.gpa ? parseFloat(studentData.gpa) : null,
                    status: studentData.status || 'Đang học'
                };

                // Validate email format nếu có
                if (cleanedData.email && !ExcelUtils.isValidEmail(cleanedData.email)) {
                    results.errors.push({
                        index: index,
                        student_id: cleanedData.student_id,
                        error: 'Email không đúng định dạng'
                    });
                    continue;
                }

                // Kiểm tra student_id đã tồn tại chưa
                const existingStudent = await Student.findOne({
                    where: { student_id: cleanedData.student_id }
                });
                if (existingStudent) {
                    results.errors.push({
                        index: index,
                        student_id: cleanedData.student_id,
                        error: 'Mã học viên đã tồn tại'
                    });
                    continue;
                }

                // Kiểm tra email đã tồn tại chưa (nếu có)
                if (cleanedData.email) {
                    const existingEmail = await Student.findOne({
                        where: { email: cleanedData.email }
                    });
                    if (existingEmail) {
                        results.errors.push({
                            index: index,
                            student_id: cleanedData.student_id,
                            error: 'Email đã tồn tại'
                        });
                        continue;
                    }
                }

                // Tạo Student mới
                const newStudent = await Student.create(cleanedData);
                results.success.push(newStudent);

            } catch (error) {
                results.errors.push({
                    index: index,
                    student_id: studentData.student_id || 'N/A',
                    error: error.message || 'Lỗi không xác định'
                });
            }
        }
        return results;
    } catch (error) {
        console.error("Error importing students from JSON:", error);
        throw error;
    }
};



