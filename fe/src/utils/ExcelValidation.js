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

// Helper function để format time
const formatTime = (timeValue) => {
    if (!timeValue) return '';

    // Nếu là số thập phân (Excel time)
    if (typeof timeValue === 'number' && timeValue >= 0 && timeValue < 1) {
        // Chuyển số thập phân sang phút
        const totalMinutes = Math.round(timeValue * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        // Đảm bảo 2 chữ số
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Nếu là string và có format HH:MM
    if (typeof timeValue === 'string') {
        // Loại bỏ khoảng trắng
        const cleanTime = timeValue.trim();

        // Nếu format HH:MM, giữ nguyên
        if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(cleanTime)) {
            return cleanTime;
        }

        // Nếu có format HH:MM:SS, chỉ lấy HH:MM
        if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(cleanTime)) {
            return cleanTime.substring(0, 5);
        }
    }

    return timeValue;
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

    // Kiểm tra các trường bắt buộc (không coi số 0 là thiếu)
    const missingFields = requiredLecturerFields.filter(field => {
        const value = lecturer[field];
        return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
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
            lecturer_id: row['Mã giảng viên']?.trim() || row['lecturer_id']?.trim() || '',
            name: row['Họ tên']?.trim() || row['name']?.trim() || '',
            email: row['Email']?.trim() || row['email']?.trim() || '',
            day_of_birth: formatDate(row['Ngày sinh'] || row['day_of_birth']),
            gender: row['Giới tính']?.trim() || row['gender']?.trim() || '',
            address: row['Địa chỉ']?.trim() || row['address']?.trim() || '',
            phone_number: row['Số điện thoại'] || row['phone_number'] || '',
            academic_rank: row['Học hàm']?.trim() || row['academic_rank']?.trim() || '',
            subjectIds: row['Mã học phần'] ? row['Mã học phần'].split(',').map(id => id.trim()) : [],
            department: row['Khoa/Bộ môn']?.trim() || row['department']?.trim() || '',
            degree: row['Học vị']?.trim() || row['degree']?.trim() || '',
            status: row['Trạng thái']?.trim() || row['status']?.trim() || 'Hoạt động',
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

    // Kiểm tra các trường bắt buộc (không coi số 0 là thiếu)
    const missingFields = requiredStudentFields.filter(field => {
        const value = student[field];
        return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
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
            student_id: row['Mã học viên']?.trim() || row['student_id']?.trim() || '',
            name: row['Họ tên']?.trim() || row['name']?.trim() || '',
            email: row['Email']?.trim() || row['email']?.trim() || '',
            day_of_birth: formatDate(row['Ngày sinh'] || row['day_of_birth']),
            gender: row['Giới tính']?.trim() || row['gender']?.trim() || '',
            address: row['Địa chỉ']?.trim() || row['address']?.trim() || '',
            phone_number: row['Số điện thoại'] || row['phone_number'] || '',
            class: row['Lớp'] || row['class'] || '',
            admission_year: formatDate(row['Năm nhập học'] || row['admission_year']),
            gpa: row['Điểm trung bình'] || row['gpa'] || '',
            status: row['Trạng thái']?.trim() || row['status']?.trim() || 'Đang học',
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

    // Kiểm tra các trường bắt buộc (không coi số 0 là thiếu)
    const missingFields = requiredProgramFields.filter(field => {
        const value = program[field];
        return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
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
            program_id: row['Mã chương trình']?.trim() || row['program_id']?.trim() || '',
            program_name: row['Tên chương trình']?.trim() || row['program_name']?.trim() || '',
            training_duration: row['Thời gian đào tạo'] || row['training_duration'] || '',
            description: row['Mô tả']?.trim() || row['description']?.trim() || '',
            status: row['Trạng thái']?.trim() || row['status']?.trim() || 'Hoạt động',
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

    // Kiểm tra các trường bắt buộc (không coi số 0 là thiếu)
    const missingFields = requiredSemesterFields.filter(field => {
        const value = semester[field];
        return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
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
            semester_id: row['Mã học kỳ']?.trim() || row['semester_id']?.trim() || '',
            semester_name: row['Tên học kỳ']?.trim() || row['semester_name']?.trim() || '',
            start_date: formatDate(row['Ngày bắt đầu'] || row['start_date']),
            end_date: formatDate(row['Ngày kết thúc'] || row['end_date']),
            status: row['Trạng thái']?.trim() || row['status']?.trim() || 'Hoạt động',
            program_id: row['Mã chương trình đào tạo']?.trim() || row['Mã chương trình']?.trim() || row['program_id'] || '',
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


    // Sửa lại: Dùng `value === null || value === undefined || (typeof value === 'string' && value.trim() === '')`
    // Điều kiện này sẽ không coi số 0 là giá trị thiếu
    const missingFields = requiredSubjectFields.filter(field => {
        const value = subject[field];
        return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
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
            subject_id: row['Mã học phần']?.trim() || row['Mã môn học']?.trim() || row['subject_id']?.trim() || '',
            subject_name: row['Tên học phần']?.trim() || row['Tên học phần']?.trim() || row['subject_name']?.trim() || '',
            credit: row['Số tín chỉ'] ?? row['credit'] ?? '',
            theory_hours: row['Số giờ lý thuyết'] ?? row['theory_hours'] ?? '',
            practice_hours: row['Số giờ thực hành'] ?? row['practice_hours'] ?? '',
            status: row['Trạng thái']?.trim() || row['status']?.trim() || 'Hoạt động',
            semester_id: row['Mã học kỳ']?.trim() || row['semester_id']?.trim() || '',
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

//validate timeslot data
const requiredTimeslotFields = [
    'slot_id',
    'slot_name',
    'start_time',
    'end_time',
    'type',
    'status',
];

const validateTimeslotData = (timeslot, existingTimeslots, allImportData = []) => {
    const errors = [];

    // Kiểm tra trùng lặp mã timeslot với dữ liệu hiện có
    const isDuplicateExisting = existingTimeslots.some(
        existing => existing.slot_id === timeslot.slot_id
    );

    // Kiểm tra trùng lặp trong dữ liệu import
    const isDuplicateImport = allImportData.filter(
        item => item.slot_id === timeslot.slot_id
    ).length > 1;

    if (isDuplicateExisting || isDuplicateImport) {
        errors.push('duplicate_id');
    }

    // Kiểm tra trùng lặp khung thời gian với dữ liệu hiện có
    const normalizedStartTime = normalizeTime(timeslot.start_time);
    const normalizedEndTime = normalizeTime(timeslot.end_time);

    const isDuplicateTimeExisting = existingTimeslots.some(
        existing => normalizeTime(existing.start_time) === normalizedStartTime &&
            normalizeTime(existing.end_time) === normalizedEndTime
    );

    // Kiểm tra trùng lặp khung thời gian trong dữ liệu import
    const isDuplicateTimeImport = allImportData.filter(
        item => normalizeTime(item.start_time) === normalizedStartTime &&
            normalizeTime(item.end_time) === normalizedEndTime &&
            item.slot_id !== timeslot.slot_id
    ).length > 0;

    if (isDuplicateTimeExisting || isDuplicateTimeImport) {
        errors.push('duplicate_time_range');
    }

    // Kiểm tra các trường bắt buộc (không coi số 0 là thiếu)
    const missingFields = requiredTimeslotFields.filter(field => {
        const value = timeslot[field];
        return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
        errors.push('missing_required');
    }

    // Kiểm tra định dạng thời gian (chỉ HH:MM)
    const timeRegexHHMM = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    // Validate định dạng thời gian (HH:MM:SS)
    const timeRegexHHMMSS = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

    if (timeslot.start_time && !timeRegexHHMM.test(timeslot.start_time) && !timeRegexHHMMSS.test(timeslot.start_time)) {
        errors.push('Định dạng giờ không hợp lệ (HH:MM hoặc HH:MM:SS)');
    }

    if (timeslot.end_time && !timeRegexHHMM.test(timeslot.end_time) && !timeRegexHHMMSS.test(timeslot.end_time)) {
        errors.push('Định dạng giờ không hợp lệ (HH:MM hoặc HH:MM:SS)');
    }

    // Kiểm tra start_time phải nhỏ hơn end_time
    if (timeslot.start_time && timeslot.end_time) {
        const startTime = new Date(`1970-01-01T${timeslot.start_time}:00`);
        const endTime = new Date(`1970-01-01T${timeslot.end_time}:00`);

        if (startTime >= endTime) {
            errors.push('invalid_time_range');
        }
    }

    return errors;
};

export const processExcelDataTimeslot = (rawData, existingTimeslots) => {
    // Xử lý dữ liệu thô từ Excel
    const processedData = rawData.map((row, index) => {
        // Chuẩn hóa dữ liệu
        const timeslot = {
            slot_id: row['Mã khung giờ']?.trim() || row['Mã khung thời gian']?.trim() || row['slot_id']?.trim() || '',
            slot_name: row['Tên khung giờ']?.trim() || row['Tên khung thời gian']?.trim() || row['slot_name']?.trim() || '',
            start_time: formatTime(row['Giờ bắt đầu'] || row['Thời gian bắt đầu'] || row['start_time'] || ''),
            end_time: formatTime(row['Giờ kết thúc'] || row['Thời gian kết thúc'] || row['end_time'] || ''),
            type: row['Loại']?.trim() || row['Buổi']?.trim() || row['type'] || '',
            description: row['Mô tả']?.trim() || row['description']?.trim() || '',
            status: row['Trạng thái']?.trim() || row['status']?.trim() || 'active',
            rowIndex: index + 2 // +2 vì Excel bắt đầu từ row 1 và có header
        };

        // Validate dữ liệu
        const errors = validateTimeslotData(timeslot, existingTimeslots, rawData);

        return {
            ...timeslot,
            errors
        };
    });

    return processedData;
};

// Helper function để normalize time format cho việc so sánh
const normalizeTime = (timeString) => {
    if (!timeString) return '';

    // Nếu có format HH:MM:SS, chỉ lấy HH:MM
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(timeString)) {
        return timeString.substring(0, 5);
    }

    // Nếu đã là HH:MM, giữ nguyên
    return timeString;
};

//validate room data
const requiredRoomFields = [
    'room_id',
    'room_name',
    'location',
    'capacity',
    'status',
    'type',
];

const validateRoomData = (room, existingRooms, allImportData = []) => {
    const errors = [];

    // Kiểm tra trùng lặp mã phòng với dữ liệu hiện có
    const isDuplicateExisting = existingRooms.some(
        existing => existing.room_id === room.room_id
    );

    // Kiểm tra trùng lặp trong dữ liệu import
    const isDuplicateImport = allImportData.filter(
        item => item.room_id === room.room_id
    ).length > 1;

    if (isDuplicateExisting || isDuplicateImport) {
        errors.push('duplicate_id');
    }

    // Kiểm tra các trường bắt buộc (không coi số 0 là thiếu)
    const missingFields = requiredRoomFields.filter(field => {
        const value = room[field];
        return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
        errors.push('missing_required');
    }

    // Kiểm tra capacity format (phải là số dương)
    if (room.capacity) {
        const capacity = parseFloat(room.capacity);
        if (isNaN(capacity) || capacity <= 0) {
            errors.push('invalid_capacity');
        }
    }

    return errors;
};

export const processExcelDataRoom = (rawData, existingRooms) => {
    // Xử lý dữ liệu thô từ Excel
    const processedData = rawData.map((row, index) => {
        // Chuẩn hóa dữ liệu
        const room = {
            // Sử dụng `?.trim()` để loại bỏ khoảng trắng một cách an toàn
            room_id: row['Mã phòng']?.trim() || row['room_id']?.trim() || '',
            room_name: row['Tên phòng']?.trim() || row['room_name']?.trim() || '',
            location: row['Vị trí']?.trim() || row['location']?.trim() || '',

            // Giữ nguyên với các giá trị không phải chuỗi hoặc có logic mặc định
            capacity: row['Sức chứa'] || row['capacity'] || '',
            status: row['Trạng thái'] || row['status'] || 'available',

            // Áp dụng trim cho các trường chuỗi còn lại
            type: row['Loại phòng']?.trim() || row['type']?.trim() || '',
            note: row['Ghi chú']?.trim() || row['note']?.trim() || '',

            rowIndex: index + 2
        };

        // Validate dữ liệu
        const errors = validateRoomData(room, existingRooms, rawData);

        return {
            ...room,
            errors
        };
    });

    return processedData;
};