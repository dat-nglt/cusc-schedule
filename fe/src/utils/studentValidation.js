// Utility functions for validating student data from Excel import

export const validGenders = ['Nam', 'Nữ'];

export const requiredFields = [
    'student_id',
    'name',
    'email',
    'day_of_birth',
    'gender',
    'address',
    'phone_number',
    'class',
    'admission_year',
];

export const validateStudentData = (student, existingStudents, allImportData = []) => {
    const errors = [];

    // Kiểm tra trùng lặp mã học viên với dữ liệu hiện có
    const isDuplicateExisting = existingStudents.some(
        existing => existing.student_id === student.student_id
    );

    // Kiểm tra trùng lặp trong dữ liệu import
    const isDuplicateImport = allImportData.filter(
        item => item.student_id === student.student_id
    ).length > 1;

    if (isDuplicateExisting || isDuplicateImport) {
        errors.push('duplicate_id');
    }

    // Kiểm tra các trường bắt buộc
    const missingFields = requiredFields.filter(field => {
        const value = student[field];
        return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
        errors.push('missing_required');
    }

    // Kiểm tra format email
    if (student.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(student.email)) {
            errors.push('invalid_email');
        }
    }

    // Kiểm tra format số điện thoại
    if (student.phone_number) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(student.phone_number.toString())) {
            errors.push('invalid_phone');
        }
    }    // Kiểm tra ngày sinh 
    if (student.day_of_birth) {
        const birthDate = new Date(student.day_of_birth);
        const today = new Date();

        if (isNaN(birthDate.getTime()) || birthDate >= today) {
            errors.push('invalid_date');
        }
    }

    // Kiểm tra giới tính
    if (student.gender && !validGenders.includes(student.gender)) {
        errors.push('invalid_gender');
    }

    return errors;
};

export const processExcelDataStudent = (rawData, existingStudents) => {
    // Xử lý dữ liệu thô từ Excel
    const processedData = rawData.map((row, index) => {
        // Chuẩn hóa dữ liệu
        const student = {
            student_id: row['Mã học viên'] || row['student_id'] || '',
            name: row['Họ tên'] || row['name'] || '',
            email: row['Email'] || row['email'] || '',
            day_of_birth: formatDate(row['Ngày sinh'] || row['day_of_birth']),
            gender: row['Giới tính'] || row['gender'] || '',
            address: row['Địa chỉ'] || row['address'] || '',
            phone_number: row['Số điện thoại'] || row['phone_number'] || '',
            class: row['Lớp'] || row['class'] || '',
            admission_year: row['Năm nhập học'] || row['admission_year'] || '',
            gpa: row['Điểm trung bình'] || row['gpa'] || '',
            status: row['Trạng thái'] || row['status'] || 'Đang học',
            rowIndex: index + 2 // +2 vì Excel bắt đầu từ row 1 và có header
        };

        // Validate dữ liệu
        const errors = validateStudentData(student, existingStudents, rawData);

        return {
            ...student,
            errors
        };
    });

    return processedData;
};

// Helper function để format date từ Excel
const formatDate = (dateValue) => {
    if (!dateValue) return '';

    // Nếu là Excel date number
    if (typeof dateValue === 'number') {
        const excelEpoch = new Date(1900, 0, 1);
        const date = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
        return date.toISOString().split('T')[0];
    }

    // Nếu là string date
    if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    }

    // Nếu đã là Date object
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue.toISOString().split('T')[0];
    }

    return '';
};
