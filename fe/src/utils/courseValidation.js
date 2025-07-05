export const validStatuses = ['Hoạt động', 'Ngừng hoạt động'];

export const requiredFields = [
    'course_id',
    'course_name',
    'start_date',
    'end_date',
];

export const validateCourseData = (course, existingCourses, allImportData = []) => {
    const errors = [];

    // Kiểm tra trùng lặp mã khóa học với dữ liệu hiện có
    const isDuplicateExisting = existingCourses.some(
        existing => existing.course_id === course.course_id
    );

    // Kiểm tra trùng lặp trong dữ liệu import
    const isDuplicateImport = allImportData.filter(
        item => item.course_id === course.course_id
    ).length > 1;

    if (isDuplicateExisting || isDuplicateImport) {
        errors.push('duplicate_id');
    }

    // Kiểm tra các trường bắt buộc
    const missingFields = requiredFields.filter(field => {
        const value = course[field];
        return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
        errors.push('missing_required');
    }

    // Kiểm tra định dạng ngày
    if (course.start_date) {
        const startDate = new Date(course.start_date);
        const today = new Date();
        if (isNaN(startDate.getTime()) || startDate > today) {
            errors.push('invalid_date');
        }
    }

    if (course.end_date) {
        const endDate = new Date(course.end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5);

        if (isNaN(endDate.getTime()) || endDate > maxFutureDate) {
            errors.push('invalid_date');
        }
    }

    // Kiểm tra thời gian bắt đầu và kết thúc
    if (course.start_date && course.end_date) {
        const startDate = new Date(course.start_date);
        const endDate = new Date(course.end_date);
        if (startDate > endDate) {
            errors.push('invalid_date_range');
        }
    }

    // Kiểm tra trạng thái
    if (course.status && !validStatuses.includes(course.status)) {
        errors.push('invalid_status');
    }

    return errors;
};

export const processExcelData = (rawData, existingCourses) => {
    // Xử lý dữ liệu thô từ Excel
    const processedData = rawData.map((row, index) => {
        // Chuẩn hóa dữ liệu
        const course = {
            course_id: row['Mã khóa học'] || row['course_id'] || '',
            course_name: row['Tên khóa học'] || row['course_name'] || '',
            start_date: formatDate(row['Thời gian bắt đầu'] || row['start_date']),
            end_date: formatDate(row['Thời gian kết thúc'] || row['end_date']),
            status: row['Trạng thái'] || row['status'] || 'Hoạt động',
            rowIndex: index + 2 // +2 vì Excel bắt đầu từ row 1 và có header
        };

        // Validate dữ liệu
        const errors = validateCourseData(course, existingCourses, rawData);

        return {
            ...course,
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