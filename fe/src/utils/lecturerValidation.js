// Utility functions for validating lecturer data from Excel import

export const validGenders = ['Nam', 'Nữ'];

export const requiredFields = [
    'lecturer_id',
    'name',
    'email',
    'day_of_birth',
    'gender',
    'address',
    'phone_number',
    'department',
    'hire_date',
    'degree'
];

export const validateLecturerData = (lecturer, existingLecturers, allImportData = []) => {
    const errors = [];

    // Kiểm tra trùng lặp mã giảng viên với dữ liệu hiện có
    const isDuplicateExisting = existingLecturers.some(
        existing => existing.lecturer_id === lecturer.lecturer_id
    );

    // Kiểm tra trùng lặp trong dữ liệu import
    const isDuplicateImport = allImportData.filter(
        item => item.lecturer_id === lecturer.lecturer_id
    ).length > 1;

    if (isDuplicateExisting || isDuplicateImport) {
        errors.push('duplicate_id');
    }

    // Kiểm tra các trường bắt buộc
    const missingFields = requiredFields.filter(field => {
        const value = lecturer[field];
        return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
        errors.push('missing_required');
    }

    // Kiểm tra format email
    if (lecturer.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(lecturer.email)) {
            errors.push('invalid_email');
        }
    }

    // Kiểm tra format số điện thoại
    if (lecturer.phone_number) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(lecturer.phone_number.toString())) {
            errors.push('invalid_phone');
        }
    }    // Kiểm tra ngày sinh và ngày tuyển dụng
    if (lecturer.day_of_birth) {
        const birthDate = new Date(lecturer.day_of_birth);
        const today = new Date();

        if (isNaN(birthDate.getTime()) || birthDate >= today) {
            errors.push('invalid_date');
        }
    }

    if (lecturer.hire_date) {
        const hireDate = new Date(lecturer.hire_date);
        const today = new Date();

        if (isNaN(hireDate.getTime()) || hireDate > today) {
            errors.push('invalid_date');
        }
    }

    // Kiểm tra giới tính
    if (lecturer.gender && !validGenders.includes(lecturer.gender)) {
        errors.push('invalid_gender');
    }

    return errors;
};

export const processExcelData = (rawData, existingLecturers) => {
    // Xử lý dữ liệu thô từ Excel
    const processedData = rawData.map((row, index) => {
        // Chuẩn hóa dữ liệu
        const lecturer = {
            lecturer_id: row['Mã giảng viên'] || row['lecturer_id'] || '',
            name: row['Họ tên'] || row['name'] || '',
            email: row['Email'] || row['email'] || '',
            day_of_birth: formatDate(row['Ngày sinh'] || row['day_of_birth']),
            gender: row['Giới tính'] || row['gender'] || '',
            address: row['Địa chỉ'] || row['address'] || '',
            phone_number: row['Số điện thoại'] || row['phone_number'] || '',
            department: row['Khoa/Bộ môn'] || row['department'] || '',
            hire_date: formatDate(row['Ngày tuyển dụng'] || row['hire_date']),
            degree: row['Học vị'] || row['degree'] || '',
            status: row['Trạng thái'] || row['status'] || 'Hoạt động',
            rowIndex: index + 2 // +2 vì Excel bắt đầu từ row 1 và có header
        };

        // Validate dữ liệu
        const errors = validateLecturerData(lecturer, existingLecturers, rawData);

        return {
            ...lecturer,
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
