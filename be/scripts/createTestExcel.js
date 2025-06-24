import XLSX from 'xlsx';
import path from 'path';

// Tạo file Excel test với header tiếng Việt
function createVietnameseTestFile() {
    const data = [
        {
            'Mã giảng viên': 'GV001',
            'Họ tên': 'Nguyễn Văn A',
            'Email': 'nguyenvana@test.com',
            'Ngày sinh': '1980-01-15',
            'Giới tính': 'Nam',
            'Địa chỉ': '123 Đường Test, Quận 1, TP.HCM',
            'Số điện thoại': '0123456789',
            'Khoa/Bộ môn': 'Khoa Công Nghệ Thông Tin',
            'Ngày tuyển dụng': '2020-09-01',
            'Học vị': 'Tiến sỹ',
            'Trạng thái': 'active'
        },
        {
            'Mã giảng viên': 'GV002',
            'Họ tên': 'Trần Thị B',
            'Email': 'tranthib@test.com',
            'Ngày sinh': '1985-05-20',
            'Giới tính': 'Nữ',
            'Địa chỉ': '456 Đường Test, Quận 3, TP.HCM',
            'Số điện thoại': '0987654321',
            'Khoa/Bộ môn': 'Khoa Kinh Tế',
            'Ngày tuyển dụng': '2021-02-15',
            'Học vị': 'Thạc sỹ',
            'Trạng thái': 'active'
        },
        {
            'Mã giảng viên': 'GV003',
            'Họ tên': 'Lê Văn C',
            'Email': 'levanc@test.com',
            'Ngày sinh': '1978-12-10',
            'Giới tính': 'Nam',
            'Địa chỉ': '789 Đường Test, Quận 5, TP.HCM',
            'Số điện thoại': '0369852741',
            'Khoa/Bộ môn': 'Khoa Toán - Tin',
            'Ngày tuyển dụng': '2019-08-20',
            'Học vị': 'Tiến sỹ',
            'Trạng thái': 'active'
        }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths for better readability
    const colWidths = [
        { wch: 15 }, // Mã giảng viên
        { wch: 20 }, // Họ tên
        { wch: 25 }, // Email
        { wch: 12 }, // Ngày sinh
        { wch: 10 }, // Giới tính
        { wch: 30 }, // Địa chỉ
        { wch: 15 }, // Số điện thoại
        { wch: 25 }, // Khoa/Bộ môn
        { wch: 15 }, // Ngày tuyển dụng
        { wch: 12 }, // Học vị
        { wch: 12 }  // Trạng thái
    ];
    
    worksheet['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lecturers');
    
    const filePath = path.join(process.cwd(), 'lecturer_sample_vietnamese.xlsx');
    XLSX.writeFile(workbook, filePath);
    
    console.log(`✅ File Excel mẫu đã được tạo: ${filePath}`);
    console.log('\n📋 Cấu trúc file:');
    console.log('- Mã giảng viên (bắt buộc)');
    console.log('- Họ tên (bắt buộc)');
    console.log('- Email');
    console.log('- Ngày sinh (định dạng: YYYY-MM-DD)');
    console.log('- Giới tính');
    console.log('- Địa chỉ');
    console.log('- Số điện thoại');
    console.log('- Khoa/Bộ môn');
    console.log('- Ngày tuyển dụng (định dạng: YYYY-MM-DD)');
    console.log('- Học vị');
    console.log('- Trạng thái (active/inactive)');
    
    return filePath;
}

// Tạo file với lỗi để test validation
function createErrorTestFile() {
    const data = [
        {
            'Mã giảng viên': 'GV004',
            'Họ tên': 'Phạm Văn D',
            'Email': 'invalid-email-format', // Email sai format
            'Ngày sinh': '1990-03-15',
            'Giới tính': 'Nam',
            'Khoa/Bộ môn': 'Khoa Điện',
            'Trạng thái': 'active'
        },
        {
            'Mã giảng viên': '', // Thiếu mã giảng viên
            'Họ tên': 'Nguyễn Thị E',
            'Email': 'nguyenthie@test.com',
            'Ngày sinh': '1988-07-22',
            'Giới tính': 'Nữ',
            'Khoa/Bộ môn': 'Khoa Hóa',
            'Trạng thái': 'active'
        },
        {
            'Mã giảng viên': 'GV005',
            'Họ tên': '', // Thiếu tên
            'Email': 'test@test.com',
            'Ngày sinh': '1992-11-08',
            'Giới tính': 'Nam',
            'Khoa/Bộ môn': 'Khoa Lý',
            'Trạng thái': 'active'
        }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lecturers');
    
    const filePath = path.join(process.cwd(), 'lecturer_error_test.xlsx');
    XLSX.writeFile(workbook, filePath);
    
    console.log(`⚠️  File Excel test lỗi đã được tạo: ${filePath}`);
    console.log('File này chứa các lỗi để test validation:');
    console.log('- Dòng 2: Email sai định dạng');
    console.log('- Dòng 3: Thiếu mã giảng viên');
    console.log('- Dòng 4: Thiếu họ tên');
    
    return filePath;
}

// Chạy script
if (process.argv[2] === 'error') {
    createErrorTestFile();
} else {
    createVietnameseTestFile();
}

export { createVietnameseTestFile, createErrorTestFile };
