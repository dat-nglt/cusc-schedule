const validGenders = ['Nam', 'Nữ'];
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

//validate lecturer data
const requiredLecturerFields = [
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

const validateLecturerData = (lecturer, existingLecturers, allImportData = []) => {
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
    const missingFields = requiredLecturerFields.filter(field => {
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

export const processExcelDataLecturer = (rawData, existingLecturers) => {
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


//validate student data
const requiredStudentFields = [
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

const validateStudentData = (student, existingStudents, allImportData = []) => {
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
    const missingFields = requiredStudentFields.filter(field => {
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
    }
    // Kiểm tra ngày sinh 
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
            admission_year: formatDate(row['Năm nhập học'] || row['admission_year']),
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


//validate program data
const requiredProgramFields = [
    'program_id',
    'program_name',
    'training_duration',
    'description',
];

const validateProgramData = (program, existingPrograms, allImportData = []) => {
    const errors = [];

    // Kiểm tra trùng lặp mã chương trình với dữ liệu hiện có
    const isDuplicateExisting = existingPrograms.some(
        existing => existing.program_id === program.program_id
    );

    // Kiểm tra trùng lặp trong dữ liệu import
    const isDuplicateImport = allImportData.filter(
        item => item.program_id === program.program_id
    ).length > 1;

    if (isDuplicateExisting || isDuplicateImport) {
        errors.push('duplicate_id');
    }

    // Kiểm tra các trường bắt buộc
    const missingFields = requiredProgramFields.filter(field => {
        const value = program[field];
        return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
        errors.push('missing_required');
    }

    // Kiểm tra training_duration format (phải là số dương)
    if (program.training_duration) {
        const duration = parseFloat(program.training_duration);
        if (isNaN(duration) || duration <= 0) {
            errors.push('invalid_training_duration');
        }
    }

    return errors;
};

export const processExcelDataProgram = (rawData, existingPrograms) => {
    // Xử lý dữ liệu thô từ Excel
    const processedData = rawData.map((row, index) => {
        // Chuẩn hóa dữ liệu
        const program = {
            program_id: row['Mã chương trình'] || row['program_id'] || '',
            program_name: row['Tên chương trình'] || row['program_name'] || '',
            training_duration: row['Thời gian đào tạo'] || row['training_duration'] || '',
            description: row['Mô tả'] || row['description'] || '',
            status: row['Trạng thái'] || row['status'] || 'Hoạt động',
            rowIndex: index + 2 // +2 vì Excel bắt đầu từ row 1 và có header
        };

        // Validate dữ liệu
        const errors = validateProgramData(program, existingPrograms, rawData);

        return {
            ...program,
            errors
        };
    });

    return processedData;
};



//validate semester data
const requiredSemesterFields = [
    'semester_id',
    'semester_name',
    'start_date',
    'end_date',
    'status',
    'program_id',
];

const validateSemesterData = (semester, existingSemesters, allImportData = []) => {
    const errors = [];

    // Kiểm tra trùng lặp mã học kỳ với dữ liệu hiện có
    const isDuplicateExisting = existingSemesters.some(
        existing => existing.semester_id === semester.semester_id
    );

    // Kiểm tra trùng lặp trong dữ liệu import
    const isDuplicateImport = allImportData.filter(
        item => item.semester_id === semester.semester_id
    ).length > 1;

    if (isDuplicateExisting || isDuplicateImport) {
        errors.push('duplicate_id');
    }

    // Kiểm tra các trường bắt buộc
    const missingFields = requiredSemesterFields.filter(field => {
        const value = semester[field];
        return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
        errors.push('missing_required');
    }

    // Kiểm tra định dạng start_date
    if (semester.start_date) {
        const startDate = new Date(semester.start_date);
        if (isNaN(startDate.getTime())) {
            errors.push('invalid_start_date');
        }
    }

    // Kiểm tra định dạng end_date
    if (semester.end_date) {
        const endDate = new Date(semester.end_date);
        if (isNaN(endDate.getTime())) {
            errors.push('invalid_end_date');
        }
    }

    // Kiểm tra start_date phải nhỏ hơn end_date
    if (semester.start_date && semester.end_date) {
        const startDate = new Date(semester.start_date);
        const endDate = new Date(semester.end_date);

        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate >= endDate) {
            errors.push('invalid_date_range');
        }
    }

    return errors;
};

export const processExcelDataSemester = (rawData, existingSemesters) => {
    // Xử lý dữ liệu thô từ Excel
    const processedData = rawData.map((row, index) => {
        // Chuẩn hóa dữ liệu
        const semester = {
            semester_id: row['Mã học kỳ'] || row['semester_id'] || '',
            semester_name: row['Tên học kỳ'] || row['semester_name'] || '',
            start_date: formatDate(row['Ngày bắt đầu'] || row['start_date']),
            end_date: formatDate(row['Ngày kết thúc'] || row['end_date']),
            status: row['Trạng thái'] || row['status'] || 'Hoạt động',
            program_id: row['Mã chương trình đào tạo'] || row['Mã chương trình'] || row['program_id'] || '',
            rowIndex: index + 2 // +2 vì Excel bắt đầu từ row 1 và có header
        };

        // Validate dữ liệu
        const errors = validateSemesterData(semester, existingSemesters, rawData);

        return {
            ...semester,
            errors
        };
    });

    return processedData;
};


//validate subject data
const requiredSubjectFields = [
    'subject_id',
    'subject_name',
    'credit',
    'theory_hours',
    'practice_hours',
    'status',
    'semester_id',
];

const validateSubjectData = (subject, existingSubjects, allImportData = []) => {
    const errors = [];

    // Kiểm tra trùng lặp mã môn học với dữ liệu hiện có
    const isDuplicateExisting = existingSubjects.some(
        existing => existing.subject_id === subject.subject_id
    );

    // Kiểm tra trùng lặp trong dữ liệu import
    const isDuplicateImport = allImportData.filter(
        item => item.subject_id === subject.subject_id
    ).length > 1;

    if (isDuplicateExisting || isDuplicateImport) {
        errors.push('duplicate_id');
    }

    // Kiểm tra các trường bắt buộc
    const missingFields = requiredSubjectFields.filter(field => {
        const value = subject[field];
        return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
        errors.push('missing_required');
    }

    // Kiểm tra credit format (phải là số dương)
    if (subject.credit) {
        const credit = parseFloat(subject.credit);
        if (isNaN(credit) || credit <= 0) {
            errors.push('invalid_credit');
        }
    }

    // Kiểm tra theory_hours format (phải là số không âm)
    if (subject.theory_hours) {
        const theoryHours = parseFloat(subject.theory_hours);
        if (isNaN(theoryHours) || theoryHours < 0) {
            errors.push('invalid_theory_hours');
        }
    }

    // Kiểm tra practice_hours format (phải là số không âm)
    if (subject.practice_hours) {
        const practiceHours = parseFloat(subject.practice_hours);
        if (isNaN(practiceHours) || practiceHours < 0) {
            errors.push('invalid_practice_hours');
        }
    }

    return errors;
};

export const processExcelDataSubject = (rawData, existingSubjects) => {
    // Xử lý dữ liệu thô từ Excel
    const processedData = rawData.map((row, index) => {
        // Chuẩn hóa dữ liệu
        const subject = {
            subject_id: row['Mã học phần'] || row['subject_id'] || '',
            subject_name: row['Tên học phần'] || row['subject_name'] || '',
            credit: row['Số tín chỉ'] || row['credit'] || '',
            theory_hours: row['Số giờ lý thuyết'] || row['theory_hours'] || '',
            practice_hours: row['Số giờ thực hành'] || row['practice_hours'] || '',
            status: row['Trạng thái'] || row['status'] || 'Hoạt động',
            semester_id: row['Mã học kỳ'] || row['semester_id'] || '',
            rowIndex: index + 2 // +2 vì Excel bắt đầu từ row 1 và có header
        };

        // Validate dữ liệu
        const errors = validateSubjectData(subject, existingSubjects, rawData);

        return {
            ...subject,
            errors
        };
    });

    return processedData;
};