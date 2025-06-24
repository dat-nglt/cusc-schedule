# Chức năng Import Giảng viên từ Excel

## Tổng quan
Chức năng này cho phép import hàng loạt thông tin giảng viên từ file Excel (.xlsx, .xls) vào hệ thống quản lý lịch học. Hệ thống sẽ validate dữ liệu, kiểm tra trùng lặp và báo cáo chi tiết kết quả import.

## Các file đã tạo/chỉnh sửa

### Backend (Node.js/Express)

1. **`be/src/services/lecturerService.js`**
   - Thêm hàm `importLecturersFromExcel()`: Import dữ liệu từ Excel buffer
   - Thêm hàm `validateExcelTemplate()`: Validate cấu trúc Excel template

2. **`be/src/controllers/lecturerController.js`**
   - Thêm `importLecturersController()`: Xử lý request import Excel
   - Thêm `downloadTemplateController()`: Tạo và download template Excel
   - Thêm `uploadExcel` middleware: Cấu hình multer cho upload file

3. **`be/src/routes/lecturerRoutes.js`**
   - Thêm route `POST /import`: Upload và import file Excel
   - Thêm route `GET /template/download`: Download template Excel

4. **`be/src/utils/ExcelUtils.js` (MỚI)**
   - Class utility để xử lý Excel files
   - Các hàm: `readExcelToJSON()`, `createExcelFromJSON()`, `validateTemplate()`, `formatExcelDate()`, etc.

5. **`be/src/tests/lecturerImport.test.js` (MỚI)**
   - Test cases cho chức năng import Excel
   - Test validation, duplicate checking, error handling

6. **`be/docs/LECTURER_IMPORT_GUIDE.md` (MỚI)**
   - Hướng dẫn chi tiết sử dụng API import Excel
   - Cấu trúc file Excel, validation rules, troubleshooting

### Frontend (React/Vite)

7. **`fe/src/components/LecturerImport.jsx` (MỚI)**
   - Component React để upload và import Excel
   - UI để download template, upload file, hiển thị kết quả
   - Sử dụng Ant Design components

8. **`fe/src/api/lecturerAPI.js` (MỚI)**
   - API service để gọi backend endpoints
   - Hàm `downloadTemplate()`, `importFromExcel()`, etc.

9. **`fe/src/pages/LecturerManagement.jsx` (MỚI)**
   - Trang quản lý giảng viên với tabs
   - Tích hợp component import Excel
   - CRUD operations cho giảng viên

## Cách sử dụng

### 1. Backend Setup
```bash
cd be
npm install  # xlsx đã có trong package.json
npm run dev  # Start development server
```

### 2. Frontend Setup  
```bash
cd fe
npm install axios antd dayjs  # Install dependencies nếu chưa có
npm run dev  # Start development server
```

### 3. Sử dụng chức năng

#### Qua API (Backend)
```bash
# Download template
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -o lecturer_template.xlsx \
     http://localhost:3000/api/lecturers/template/download

# Import Excel
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "excel_file=@lecturers.xlsx" \
  http://localhost:3000/api/lecturers/import
```

#### Qua Web Interface (Frontend)
1. Truy cập `/lecturer-management`
2. Click tab "Import Excel"
3. Download template Excel
4. Điền dữ liệu vào template
5. Upload file Excel
6. Xem kết quả import

## Cấu trúc Excel Template

| Cột | Bắt buộc | Kiểu dữ liệu | Ví dụ |
|-----|----------|--------------|-------|
| Mã giảng viên | ✓ | String(50) | GV001 |
| Họ tên | ✓ | String(50) | Nguyễn Văn A |
| Email | | String(70) | gv@university.edu.vn |
| Ngày sinh | | Date | 1980-01-15 |
| Giới tính | | String(30) | Nam/Nữ |
| Địa chỉ | | String(100) | 123 Đường ABC |
| Số điện thoại | | String(20) | 0123456789 |
| Khoa/Bộ môn | | String(100) | Khoa CNTT |
| Ngày tuyển dụng | | Date | 2020-09-01 |
| Học vị | | String(100) | Tiến sỹ |
| Trạng thái | | String(30) | active |

## Validation Rules

1. **Mã giảng viên**: Bắt buộc, không trùng lặp
2. **Họ tên**: Bắt buộc
3. **email**: Định dạng email hợp lệ, không trùng lặp
4. **Dates**: Định dạng YYYY-MM-DD hoặc Excel date
5. **File**: .xlsx/.xls, < 5MB

## Response Format

```json
{
  "status": 200,
  "data": {
    "summary": {
      "total": 10,
      "success": 8,
      "errors": 2
    },
    "successRecords": [
      {
        "row": 2,
        "lecturer_id": "GV001", 
        "name": "Nguyễn Văn A"
      }
    ],
    "errorRecords": [
      {
        "row": 3,
        "lecturer_id": "GV002",
        "error": "Email đã tồn tại"
      }
    ]
  },
  "message": "Import hoàn tất với 8/10 bản ghi thành công"
}
```

## Testing

```bash
cd be
npm test -- lecturerImport.test.js
```

## Troubleshooting

### Common Issues:
1. **"Template không hợp lệ"**: Kiểm tra cột bắt buộc `lecturer_id`, `name`
2. **"Chỉ chấp nhận file Excel"**: Upload file .xlsx hoặc .xls
3. **"File phải nhỏ hơn 5MB"**: Giảm kích thước file
4. **"Mã giảng viên đã tồn tại"**: Kiểm tra lecturer_id trùng lặp
5. **"Email không đúng định dạng"**: Sử dụng định dạng email hợp lệ

### Debug:
1. Kiểm tra console log ở browser dev tools
2. Kiểm tra network tab để xem API response
3. Kiểm tra server logs (backend console)

## Security Notes

- File upload được giới hạn 5MB
- Chỉ chấp nhận file Excel (.xlsx, .xls)
- Yêu cầu authentication với role admin/training_officer
- Validate tất cả input data
- Sử dụng multer memory storage (không lưu file xuống disk)

## Performance

- Import được xử lý tuần tự (sequential) để tránh database lock
- Với file lớn (>1000 records), có thể mất vài phút
- Sử dụng transaction để đảm bảo data consistency
- Memory usage được tối ưu với multer memory storage

## Future Enhancements

1. **Batch processing**: Xử lý theo batch để cải thiện performance
2. **Background jobs**: Sử dụng job queue cho file lớn
3. **Progress tracking**: Real-time progress updates
4. **Export functionality**: Export danh sách giảng viên ra Excel
5. **Data mapping**: Cho phép map các cột Excel với database fields
6. **Preview mode**: Preview data trước khi import thực tế
