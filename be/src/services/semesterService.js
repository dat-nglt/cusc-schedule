import Semester from "../models/Semesters";

export const getAllSemesters = async () => {
    try {
        const semesters = await Semester.findAll();
        return semesters;
    } catch (error) {
        console.error('Error fetching semesters:', error);
        throw error;
    }
};

export const getSemesterById = async (id) => {
    try {
        const semester = await Semester.findByPk(id);
        return semester;
    } catch (error) {
        console.error(`Error fetching semester with id ${id}:`, error);
        throw error;
    }
};

export const createSemester = async (semesterData) => {
    try {
        const semester = await Semester.create(semesterData);
        return semester;
    } catch (error) {
        console.error('Error creating semester:', error);
        throw error;
    }
};

export const updateSemester = async (id, semesterData) => {
    try {
        const semester = await Semester.findByPk(id);
        if (!semester) throw new Error("Semester not found");
        return await semester.update(semesterData);
    } catch (error) {
        console.error(`Error updating semester with id ${id}:`, error);
        throw error;
    }
};

export const deleteSemester = async (id) => {
    try {
        const semester = await Semester.findByPk(id);
        if (!semester) throw new Error("Semester not found");
        await semester.destroy();
        return { message: "Semester deleted successfully" };
    } catch (error) {
        console.error(`Error deleting semester with id ${id}:`, error);
        throw error;
    }
};

export const importSemestersFromJSON = async (semestersData) => {
    try {
        if (!semestersData || !Array.isArray(semestersData)) {
            throw new Error("Dữ liệu không hợp lệ");
        }
        const results = {
            success: [],
            errors: [],
            total: semestersData.length
        };

        //validate and create semester for each item
        for (let i = 0; i < semestersData.length; i++) {
            const semesterData = semestersData[i];
            const index = i + 1;

            try {
                //validate required fields
                if (!semesterData.semester_id || !semesterData.semester_name) {
                    results.errors.push({
                        index: index,
                        semester_id: semesterData.semester_id || 'N/A',
                        error: 'Mã học kỳ và tên học kỳ là bắt buộc'
                    });
                    continue;
                }

                // clean and format data (chuyển sang kiểu chuỗi và xóa khoảng cách thừa ở đầu chuỗi và cuối chuỗi)
                const cleanedData = {
                    semester_id: semesterData.semester_id.toString().trim(),
                    semester_name: semesterData.semester_name.toString().trim(),
                    start_date: semesterData.start_date ? new Date(semesterData.start_date) : null,
                    end_date: semesterData.end_date ? new Date(semesterData.end_date) : null,
                    program_id: semesterData.program_id ? semesterData.program_id.toString().trim() : null,
                    status: semesterData.status || 'Hoạt động' // Mặc định là 'hoạt động' nếu không có giá trị,
                }

                // Kiểm tra semester_id đã tồn tại chưa
                const existingSemester = await Semester.findOne({
                    where: { semester_id: cleanedData.semester_id }
                });
                if (existingSemester) {
                    results.errors.push({
                        index: index,
                        semester_id: cleanedData.semester_id,
                        error: 'Mã học kỳ đã tồn tại'
                    });
                    continue;
                }

                // Tạo Semester mới
                const newSemester = await Semester.create(cleanedData);
                results.success.push(newSemester);

            } catch (error) {
                results.errors.push({
                    index: index,
                    semester_id: semesterData.semester_id || 'N/A',
                    error: error.message || 'Lỗi không xác định'
                });
            }
        }
        return results;
    } catch (error) {
        console.error('Error importing semesters:', error);
        throw error;
    }
};