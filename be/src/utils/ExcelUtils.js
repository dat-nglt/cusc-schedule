import XLSX from "xlsx";

/**
 * Đọc file Excel và convert thành JSON
 * @param {Buffer} fileBuffer - Buffer của file Excel
 * @param {string} [sheetName=null] - Tên sheet (optional, default là sheet đầu tiên)
 * @returns {Array} Array các object từ Excel
 */
export function readExcelToJSON(fileBuffer, sheetName = null) {
  try {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const targetSheetName = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[targetSheetName];

    if (!worksheet) {
      throw new Error(`Sheet '${targetSheetName}' không tồn tại`);
    }

    // Use { header: 1 } to get an array of arrays (rows),
    // where the first array is the header row.
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  } catch (error) {
    throw new Error(`Lỗi đọc file Excel: ${error.message}`);
  }
}

/**
 * Tạo file Excel từ JSON data
 * @param {Array} data - Array các object để export
 * @param {string} [sheetName='Sheet1'] - Tên sheet
 * @returns {Buffer} Buffer của file Excel
 */
export function createExcelFromJSON(data, sheetName = "Sheet1") {
  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  } catch (error) {
    throw new Error(`Lỗi tạo file Excel: ${error.message}`);
  }
}

/**
 * Validate cấu trúc Excel template
 * @param {Buffer} fileBuffer - Buffer của file Excel
 * @param {Array} requiredColumns - Array các cột bắt buộc (tiếng Việt)
 * @param {Array} [optionalColumns=[]] - Array các cột tùy chọn (tiếng Việt)
 * @returns {Object} Kết quả validation
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
      throw new Error(`File Excel không có sheet nào.`);
    }

    // Get header row
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const headers = [];

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        headers.push(String(cell.v).toLowerCase().trim());
      }
    }

    // Convert requiredColumns to lowercase for consistent comparison
    const lowerCaseRequiredColumns = requiredColumns.map((col) =>
      col.toLowerCase()
    );

    // Check for missing required columns
    const missingRequired = lowerCaseRequiredColumns.filter(
      (col) => !headers.includes(col)
    );

    if (missingRequired.length > 0) {
      // Find original case of missing columns for better error message
      const originalMissing = requiredColumns.filter((col) =>
        missingRequired.includes(col.toLowerCase())
      );
      return {
        valid: false,
        error: `Thiếu các cột bắt buộc: ${originalMissing.join(", ")}`,
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
 * Format Excel date number thành chuỗi ngày
 * @param {number|string} dateValue - Giá trị ngày từ Excel
 * @returns {string|null} Chuỗi ngày định dạng YYYY-MM-DD
 */
export function formatExcelDate(dateValue) {
  if (dateValue === null || dateValue === undefined || dateValue === "")
    return null;

  try {
    // If it's an Excel date number
    if (typeof dateValue === "number") {
      const date = XLSX.SSF.parse_date_code(dateValue);
      // Ensure month and day are 2 digits
      return `${date.y}-${String(date.m).padStart(2, "0")}-${String(
        date.d
      ).padStart(2, "0")}`;
    }

    // If it's a string, attempt to parse it as a date
    if (typeof dateValue === "string") {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        // Check if the date is valid
        return date.toISOString().split("T")[0]; // Get YYYY-MM-DD part
      }
    }

    return null;
  } catch (error) {
    // Log error for debugging if needed, but return null for invalid formats
    console.error("Error formatting Excel date:", error);
    return null;
  }
}

/**
 * Validate email format
 * @param {string} email - Email cần validate
 * @returns {boolean} True nếu email hợp lệ
 */
export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
}

/**
 * Clean và format chuỗi
 * @param {any} value - Giá trị cần clean
 * @returns {string|null} Chuỗi đã được clean hoặc null
 */
export function cleanString(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return String(value).trim();
}

/**
 * Tạo Excel template cho giảng viên với tên cột tiếng Việt
 * @returns {Buffer} Buffer của template Excel
 */
export function createLecturerTemplate() {
  const templateData = [
    {
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
 * Tạo Excel template cho khóa học với tên cột tiếng Việt
 * @returns {Buffer} Buffer của template Excel
 */
export function createCourseTemplate() {
  const templateData = [
    {
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
 * Tạo Excel template cho sinh viên với tên cột tiếng Việt
 * @returns {Buffer} Buffer của template Excel
 */
export function createStudentTemplate() {
  const templateData = [
    {
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
 * Map cột tiếng Việt sang tiếng Anh
 * @returns {Object} Object mapping từ tiếng Việt sang tiếng Anh
 */
export function getVietnameseColumnMapping() {
  return {
    // Common columns
    "Họ tên": "name",
    Email: "email",
    "Ngày sinh": "date_of_birth", // Changed from day_of_birth for better readability
    "Giới tính": "gender",
    "Địa chỉ": "address",
    "Số điện thoại": "phone_number",
    "Trạng thái": "status",

    // Lecturer specific columns
    "Mã giảng viên": "lecturer_id",
    "Khoa/Bộ môn": "department",
    "Ngày tuyển dụng": "hire_date",
    "Học vị": "degree",

    // Course specific columns
    "Mã khóa học": "course_id",
    "Tên khóa học": "course_name",
    "Thời gian bắt đầu": "start_date",
    "Thời gian kết thúc": "end_date",

    // Student specific columns
    "Mã học viên": "student_id",
    Lớp: "class",
    "Năm nhập học": "admission_year",
    "Điểm trung bình": "gpa",
  };
}

/**
 * Chuyển đổi data từ cột tiếng Việt sang tiếng Anh
 * @param {Array<Object>} data - Array data với cột tiếng Việt
 * @returns {Array<Object>} Array data với cột tiếng Anh
 */
export function convertVietnameseColumnsToEnglish(data) {
  const mapping = getVietnameseColumnMapping();

  return data.map((row) => {
    const convertedRow = {};
    Object.keys(row).forEach((key) => {
      // Get the English key from the mapping, or fallback to a lowercased, snake_cased version
      const englishKey = mapping[key] || key.toLowerCase().replace(/\s+/g, "_");
      convertedRow[englishKey] = row[key];
    });
    return convertedRow;
  });
}

export default {
  readExcelToJSON,
  convertVietnameseColumnsToEnglish,
  getVietnameseColumnMapping,
  createStudentTemplate,
  createCourseTemplate,
  createLecturerTemplate,
  cleanString,
  isValidEmail,
  formatExcelDate,
  validateTemplate,
  createExcelFromJSON,
};
