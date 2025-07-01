import Subject from "../models/Subject";

export const getAllSubjects = async () => {
    try {
        const subjects = await Subject.findAll();
        return subjects;
    } catch (error) {
        console.error("Error fetching subjects:", error);
        throw error;
    }
};

export const getSubjectById = async (subjectId) => {
    try {
        const subject = await Subject.findOne({
            where: { subject_id: subjectId }
        });
        return subject;
    } catch (error) {
        console.error("Error fetching subject by ID:", error);
        throw error;
    }
};


export const createSubject = async (subjectData) => {
    try {
        const newSubject = await Subject.create(subjectData);
        return newSubject;
    } catch (error) {
        console.error("Error creating subject:", error);
        throw error;
    }
};

export const updateSubject = async (subjectId, subjectData) => {
    try {
        const [updated] = await Subject.update(subjectData, {
            where: { subject_id: subjectId }
        });
        if (updated) {
            const updatedSubject = await Subject.findOne({ where: { subject_id: subjectId } });
            return updatedSubject;
        }
        throw new Error("Subject not found");
    } catch (error) {
        console.error("Error updating subject:", error);
        throw error;
    }
};


export const deleteSubject = async (subjectId) => {
    try {
        const deleted = await Subject.destroy({
            where: { subject_id: subjectId }
        });
        if (deleted) {
            return { message: "Subject deleted successfully" };
        }
        throw new Error("Subject not found");
    } catch (error) {
        console.error("Error deleting subject:", error);
        throw error;
    }
};

//tìm kiếm môn học theop học kỳ
export const getSubjectsBySemester = async (semesterId) => {
    try {
        const subjects = await Subject.findAll({
            where: { semester_id: semesterId }
        });
        return subjects;
    } catch (error) {
        console.error("Error fetching subjects by semester:", error);
        throw error;
    }
}

export const importSubjectsFromJSON = async (subjectsData) => {
    try {
        if (!subjectsData || !Array.isArray(subjectsData)) {
            throw new Error("Dữ liệu không hợp lệ");
        }
        const results = {
            success: [],
            errors: [],
            total: subjectsData.length
        };

        //validate and create subject for each item
        for (let i = 0; i < subjectsData.length; i++) {
            const subjectData = subjectsData[i];
            const index = i + 1;

            try {
                //validate required fields
                if (!subjectData.subject_id || !subjectData.subject_name) {
                    results.errors.push({
                        index: index,
                        subject_id: subjectData.subject_id || 'N/A',
                        error: 'Mã môn học và tên môn học là bắt buộc'
                    });
                    continue;
                }

                // clean and format data (chuyển sang kiểu chuỗi và xóa khoảng cách thừa ở đầu chuỗi và cuối chuỗi)
                const cleanedData = {
                    subject_id: subjectData.subject_id.toString().trim(),
                    subject_name: subjectData.subject_name.toString().trim(),
                    credit: subjectData.credit ? parseInt(subjectData.credit) : null, // Chuyển đổi sang số nguyên nếu có
                    theory_hours: subjectData.theory_hours ? parseInt(subjectData.theory_hours) : null,
                    practice_hours: subjectData.practice_hours ? parseInt(subjectData.practice_hours) : null,
                    semester_id: subjectData.semester_id ? subjectData.semester_id.toString().trim() : null,
                    status: subjectData.status || 'Hoạt động' // Mặc định là 'hoạt động' nếu không có giá trị,
                }

                // Kiểm tra subject_id đã tồn tại chưa
                const existingSubject = await Subject.findOne({
                    where: { subject_id: cleanedData.subject_id }
                });
                if (existingSubject) {
                    results.errors.push({
                        index: index,
                        subject_id: cleanedData.subject_id,
                        error: 'Mã môn học đã tồn tại'
                    });
                    continue;
                }

                // Tạo Subject mới
                const newSubject = await Subject.create(cleanedData);
                results.success.push(newSubject);

            } catch (error) {
                results.errors.push({
                    index: index,
                    subject_id: subjectData.subject_id || 'N/A',
                    error: error.message || 'Lỗi không xác định'
                });
            }
        }
        return results;
    } catch (error) {
        console.error('Error importing subjects:', error);
        throw error;
    }
};