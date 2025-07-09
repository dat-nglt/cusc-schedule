import XLSX from "xlsx";

/**
 * Đọc dữ liệu từ file Excel và chuyển đổi thành định dạng JSON.
 *
 * @param {Buffer} fileBuffer - Buffer chứa nội dung của file Excel.
 * @param {string} [sheetName=null] - (Tùy chọn) Tên của sheet cần đọc. Nếu không cung cấp, sẽ đọc sheet đầu tiên.
 * @returns {Array<Object>} Một mảng các đối tượng JSON, mỗi đối tượng đại diện cho một hàng trong Excel.
 * @throws {Error} Nếu có lỗi trong quá trình đọc file hoặc sheet không tồn tại.
 */
export function readExcelToJSON(fileBuffer, sheetName = null) {
    try {
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        // Lấy tên sheet mục tiêu, ưu tiên sheetName được cung cấp, nếu không thì lấy sheet đầu tiên.
        const targetSheetName = sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[targetSheetName];

        if (!worksheet) {
            throw new Error(`Sheet '${targetSheetName}' không tồn tại trong file Excel.`);
        }

        // Chuyển đổi worksheet thành JSON.
        // `defval: ""` đảm bảo các ô rỗng sẽ được chuyển thành chuỗi rỗng thay vì `undefined`.
        return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    } catch (error) {
        throw new Error(`Lỗi đọc file Excel: ${error.message}`);
    }
}

/**
 * Tạo một file Excel từ dữ liệu JSON cung cấp.
 *
 * @param {Array<Object>} data - Một mảng các đối tượng JSON cần xuất ra Excel.
 * @param {string} [sheetName='Sheet1'] - (Tùy chọn) Tên của sheet trong file Excel mới. Mặc định là 'Sheet1'.
 * @returns {Buffer} Buffer chứa nội dung của file Excel đã tạo.
 * @throws {Error} Nếu có lỗi trong quá trình tạo file Excel.
 */
export function createExcelFromJSON(data, sheetName = "Sheet1") {
    try {
        const workbook = XLSX.utils.book_new(); // Tạo workbook mới
        const worksheet = XLSX.utils.json_to_sheet(data); // Chuyển JSON thành worksheet

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName); // Thêm worksheet vào workbook

        // Ghi workbook ra buffer ở định dạng xlsx.
        return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    } catch (error) {
        throw new Error(`Lỗi tạo file Excel: ${error.message}`);
    }
}

/**
 * Xác thực cấu trúc của một template Excel bằng cách kiểm tra các cột bắt buộc.
 * Hàm này đọc hàng tiêu đề đầu tiên và so sánh với danh sách các cột yêu cầu.
 *
 * @param {Buffer} fileBuffer - Buffer chứa nội dung của file Excel.
 * @param {Array<string>} requiredColumns - Mảng các tên cột bắt buộc (tiếng Việt).
 * @param {Array<string>} [optionalColumns=[]] - (Tùy chọn) Mảng các tên cột tùy chọn (tiếng Việt).
 * @returns {Object} Một đối tượng chứa `valid` (boolean), `error` (string, nếu có),
 * `headers` (mảng các tiêu đề tìm thấy), `missingRequired` (mảng các cột bắt buộc bị thiếu),
 * `requiredColumns` và `optionalColumns` đã truyền vào.
 */
export function validateTemplate(
    fileBuffer,
    requiredColumns = [],
    optionalColumns = []
) {
    try {
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            throw new Error(`File Excel không có sheet nào hoặc sheet đầu tiên trống.`);
        }

        // Lấy dải ô của worksheet và trích xuất các tiêu đề từ hàng đầu tiên.
        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        const headers = [];

        // Đọc các tiêu đề từ hàng đầu tiên (row 0).
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            const cell = worksheet[cellAddress];
            if (cell && cell.v) {
                // Chuyển đổi tiêu đề về chữ thường và loại bỏ khoảng trắng để so sánh không phân biệt chữ hoa/thường.
                headers.push(String(cell.v).toLowerCase().trim());
            }
        }

        // Chuyển đổi các cột bắt buộc về chữ thường để so sánh.
        const lowerCaseRequiredColumns = requiredColumns.map((col) =>
            col.toLowerCase()
        );

        // Tìm các cột bắt buộc bị thiếu trong tiêu đề.
        const missingRequired = lowerCaseRequiredColumns.filter(
            (col) => !headers.includes(col)
        );

        if (missingRequired.length > 0) {
            // Tìm lại tên gốc (có phân biệt chữ hoa/thường) của các cột bị thiếu để thông báo lỗi rõ ràng.
            const originalMissing = requiredColumns.filter((col) =>
                missingRequired.includes(col.toLowerCase())
            );
            return {
                valid: false,
                error: `Thiếu các cột bắt buộc: ${originalMissing.join(", ")}. Vui lòng kiểm tra lại template.`,
                headers: headers,
                missingRequired: originalMissing,
            };
        }

        return {
            valid: true,
            headers: headers,
            requiredColumns: requiredColumns,
            optionalColumns: optionalColumns,
        };
    } catch (error) {
        return {
            valid: false,
            error: `Template không hợp lệ: ${error.message}`,
        };
    }
}

/**
 * Định dạng giá trị ngày tháng từ Excel thành chuỗi 'YYYY-MM-DD'.
 * Hàm này xử lý cả số ngày Excel và chuỗi ngày.
 *
 * @param {number|string} dateValue - Giá trị ngày từ Excel (có thể là số hoặc chuỗi).
 * @returns {string|null} Chuỗi ngày đã định dạng ('YYYY-MM-DD') hoặc `null` nếu giá trị không hợp lệ.
 */
export function formatExcelDate(dateValue) {
    if (dateValue === null || dateValue === undefined || dateValue === "") {
        return null;
    }

    try {
        // Nếu là số ngày Excel
        if (typeof dateValue === "number") {
            const date = XLSX.SSF.parse_date_code(dateValue);
            // Đảm bảo tháng và ngày có 2 chữ số (ví dụ: 01, 05).
            return `${date.y}-${String(date.m).padStart(2, "0")}-${String(
                date.d
            ).padStart(2, "0")}`;
        }

        // Nếu là chuỗi, thử phân tích cú pháp thành ngày
        if (typeof dateValue === "string") {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) { // Kiểm tra xem ngày có hợp lệ không
                return date.toISOString().split("T")[0]; // Lấy phần 'YYYY-MM-DD'
            }
        }

        return null; // Trả về null nếu định dạng không thể xử lý
    } catch (error) {
        console.error("Lỗi khi định dạng ngày từ Excel:", error);
        return null;
    }
}

/**
 * Xác thực định dạng email.
 *
 * @param {string} email - Chuỗi email cần xác thực.
 * @returns {boolean} `true` nếu email hợp lệ, ngược lại là `false`.
 */
export function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex cơ bản cho email
    return emailRegex.test(String(email).toLowerCase());
}

/**
 * Làm sạch và định dạng lại một chuỗi (cắt khoảng trắng ở đầu/cuối).
 *
 * @param {any} value - Giá trị cần làm sạch (có thể là bất kỳ kiểu dữ liệu nào).
 * @returns {string|null} Chuỗi đã được làm sạch, hoặc `null` nếu giá trị ban đầu là rỗng/null/undefined.
 */
export function cleanString(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    return String(value).trim();
}

/**
 * Tạo một template Excel mẫu cho dữ liệu giảng viên với các cột tiếng Việt.
 *
 * @returns {Buffer} Buffer chứa nội dung của file Excel template giảng viên.
 */
export function createLecturerTemplate() {
    const templateData = [{
            "Mã giảng viên": "GV001",
            "Họ tên": "Nguyễn Văn A",
            Email: "nguyenvana@example.com",
            "Ngày sinh": "1980-01-15",
            "Giới tính": "Nam",
            "Địa chỉ": "123 Đường ABC, Quận 1, TP.HCM",
            "Số điện thoại": "0123456789",
            "Khoa/Bộ môn": "Khoa Công Nghệ Thông Tin",
            "Ngày tuyển dụng": "2020-09-01",
            "Học vị": "Tiến sỹ",
            "Trạng thái": "Hoạt động",
        },
        {
            "Mã giảng viên": "GV002",
            "Họ tên": "Trần Thị B",
            Email: "tranthib@example.com",
            "Ngày sinh": "1985-05-20",
            "Giới tính": "Nữ",
            "Địa chỉ": "456 Đường XYZ, Quận 3, TP.HCM",
            "Số điện thoại": "0987654321",
            "Khoa/Bộ môn": "Khoa Kinh Tế",
            "Ngày tuyển dụng": "2021-02-15",
            "Học vị": "Thạc sỹ",
            "Trạng thái": "Hoạt động",
        },
    ];

    return createExcelFromJSON(templateData, "Lecturers");
}

/**
 * Tạo một template Excel mẫu cho dữ liệu khóa học với các cột tiếng Việt.
 *
 * @returns {Buffer} Buffer chứa nội dung của file Excel template khóa học.
 */
export function createCourseTemplate() {
    const templateData = [{
            "Mã khóa học": "KH001",
            "Tên khóa học": "Khóa học lập trình",
            "Thời gian bắt đầu": "2025-06-28",
            "Thời gian kết thúc": "2025-06-30",
            "Trạng thái": "Hoạt động",
        },
        {
            "Mã khóa học": "KH002",
            "Tên khóa học": "Khóa học cơ sở dữ liệu",
            "Thời gian bắt đầu": "2025-07-01",
            "Thời gian kết thúc": "2025-07-31",
            "Trạng thái": "Ngừng hoạt động",
        },
    ];

    return createExcelFromJSON(templateData, "Courses");
}

/**
 * Tạo một template Excel mẫu cho dữ liệu học viên với các cột tiếng Việt.
 *
 * @returns {Buffer} Buffer chứa nội dung của file Excel template học viên.
 */
export function createStudentTemplate() {
    const templateData = [{
            "Mã học viên": "SV001",
            "Họ tên": "Lê Văn C",
            Email: "levanc@example.com",
            "Ngày sinh": "2000-05-15",
            "Giới tính": "Nam",
            "Địa chỉ": "123 Đường DEF, Quận 2, TP.HCM",
            "Số điện thoại": "0123456789",
            Lớp: "CNTT2020",
            "Năm nhập học": "2020",
            "Điểm trung bình": "3.5",
            "Trạng thái": "active",
        },
        {
            "Mã học viên": "SV002",
            "Họ tên": "Phạm Thị D",
            Email: "phamthid@example.com",
            "Ngày sinh": "2001-12-20",
            "Giới tính": "Nữ",
            "Địa chỉ": "456 Đường GHI, Quận 7, TP.HCM",
            "Số điện thoại": "0987654321",
            Lớp: "QTKD2021",
            "Năm nhập học": "2021",
            "Điểm trung bình": "3.7",
            "Trạng thái": "active",
        },
    ];

    return createExcelFromJSON(templateData, "Students");
}

/**
 * Tạo một template Excel mẫu cho dữ liệu chương trình đào tạo với các cột tiếng Việt.
 *
 * @returns {Buffer} Buffer chứa nội dung của file Excel template chương trình đào tạo.
 */
export function createProgramTemplate() {
    const templateData = [{
            "Mã chương trình": "CT001",
            "Tên chương trình": "Chương trình Đào tạo CNTT",
            "Thời gian đào tạo": "4 năm",
            "Mô tả": "Chương trình đào tạo về công nghệ thông tin",
            "Trạng thái": "Hoạt động",
        },
        {
            "Mã chương trình": "CT002",
            "Tên chương trình": "Chương trình Đào tạo Kinh tế",
            "Thời gian đào tạo": "3 năm",
            "Mô tả": "Chương trình đào tạo về kinh tế và quản trị",
            "Trạng thái": "Ngừng hoạt động",
        },
    ];

    return createExcelFromJSON(templateData, "Programs");
}

/**
 * Tạo một template Excel mẫu cho dữ liệu học kỳ với các cột tiếng Việt.
 *
 * @returns {Buffer} Buffer chứa nội dung của file Excel template học kỳ.
 */
export function createSemesterTemplate() {
    const templateData = [{
            "Mã học kỳ": "HK2024_1",
            "Tên học kỳ": "Học kỳ 1 năm học 2024-2025",
            "Ngày bắt đầu": "2024-09-01",
            "Ngày kết thúc": "2025-01-15",
            "Trạng thái": "Hoạt động",
            "Mã chương trình đào tạo": "CT001",
        },
        {
            "Mã học kỳ": "HK2024_2",
            "Tên học kỳ": "Học kỳ 2 năm học 2024-2025",
            "Ngày bắt đầu": "2025-02-01",
            "Ngày kết thúc": "2025-06-30",
            "Trạng thái": "Sắp diễn ra",
            "Mã chương trình đào tạo": "CT001",
        },
    ];

    return createExcelFromJSON(templateData, "Semesters");
}

/**
 * Tạo một template Excel mẫu cho dữ liệu môn học với các cột tiếng Việt.
 *
 * @returns {Buffer} Buffer chứa nội dung của file Excel template môn học.
 */
export function createSubjectTemplate() {
  const templateData = [
    {
      "Mã học phần": "MH001",
      "Tên học phần": "Lập trình cơ bản",
      "Số tín chỉ": 3,
      "Số giờ lý thuyết": 30,
      "Số giờ thực hành": 15,
      "Trạng thái": "Hoạt động",
      "Mã học kỳ": "HK2024_1",
    },
    {
      "Mã học phần": "MH002",
      "Tên học phần": "Cơ sở dữ liệu",
      "Số tín chỉ": 4,
      "Số giờ lý thuyết": 45,
      "Số giờ thực hành": 15,
      "Trạng thái": "Hoạt động",
      "Mã học kỳ": "HK2024_1",
    },
  ];

    return createExcelFromJSON(templateData, "Subjects");
}

/**
 * Cung cấp ánh xạ giữa các tên cột tiếng Việt và tiếng Anh.
 * Được sử dụng để chuyển đổi tiêu đề cột khi nhập dữ liệu.
 *
 * @returns {Object} Đối tượng ánh xạ từ tên cột tiếng Việt sang tiếng Anh.
 */
export function getVietnameseColumnMapping() {
    return {
        // Cột chung
        "Họ tên": "name",
        Email: "email",
        "Ngày sinh": "date_of_birth",
        "Giới tính": "gender",
        "Địa chỉ": "address",
        "Số điện thoại": "phone_number",
        "Trạng thái": "status",

        // Cột dành riêng cho Giảng viên
        "Mã giảng viên": "lecturer_id",
        "Khoa/Bộ môn": "department",
        "Ngày tuyển dụng": "hire_date",
        "Học vị": "degree",

        // Cột dành riêng cho Khóa học
        "Mã khóa học": "course_id",
        "Tên khóa học": "course_name",
        "Thời gian bắt đầu": "start_date",
        "Thời gian kết thúc": "end_date",

        // Cột dành riêng cho Học viên
        "Mã học viên": "student_id",
        Lớp: "class",
        "Năm nhập học": "admission_year",
        "Điểm trung bình": "gpa",

        // Cột dành riêng cho Chương trình đào tạo
        "Mã chương trình": "program_id",
        "Tên chương trình": "program_name",
        "Thời gian đào tạo": "training_duration",
        "Mô tả": "description",

        // Cột dành riêng cho Học kỳ
        "Mã học kỳ": "semester_id",
        "Tên học kỳ": "semester_name",
        // "Ngày bắt đầu": "start_date", // Đã có ở cột chung, nhưng có thể muốn cụ thể hơn cho từng loại
        // "Ngày kết thúc": "end_date", // Đã có ở cột chung
        "Mã chương trình đào tạo": "training_program_id",

    // Subject specific columns
    "Mã học phần": "subject_id",
    "Tên học phần": "subject_name",
    "Số tín chỉ": "credit",
    "Số giờ lý thuyết": "theory_hours",
    "Số giờ thực hành": "practice_hours",
  };
}

/**
 * Chuyển đổi các tên cột tiếng Việt trong dữ liệu JSON sang tiếng Anh
 * dựa trên ánh xạ đã định nghĩa.
 *
 * @param {Array<Object>} data - Mảng các đối tượng dữ liệu với tên cột tiếng Việt.
 * @returns {Array<Object>} Mảng các đối tượng dữ liệu với tên cột tiếng Anh.
 */
export function convertVietnameseColumnsToEnglish(data) {
    const mapping = getVietnameseColumnMapping();

    return data.map((row) => {
        const convertedRow = {};
        Object.keys(row).forEach((key) => {
            // Lấy key tiếng Anh từ ánh xạ, hoặc fallback về phiên bản chữ thường, snake_case
            const englishKey = mapping[key] || key.toLowerCase().replace(/\s+/g, "_");
            convertedRow[englishKey] = row[key];
        });
        return convertedRow;
    });
}

// Xuất tất cả các hàm để có thể truy cập thông qua một đối tượng duy nhất
export default {
    readExcelToJSON,
    convertVietnameseColumnsToEnglish,
    getVietnameseColumnMapping,
    createStudentTemplate,
    createCourseTemplate,
    createLecturerTemplate,
    createProgramTemplate,
    createSemesterTemplate,
    createSubjectTemplate,
    cleanString,
    isValidEmail,
    formatExcelDate,
    validateTemplate,
    createExcelFromJSON,
};