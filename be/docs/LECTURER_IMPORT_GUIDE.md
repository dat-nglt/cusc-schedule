# Hướng dẫn Import Giảng viên từ File Excel

## Tổng quan

Chức năng này cho phép import hàng loạt thông tin giảng viên từ file Excel (.xlsx, .xls) vào hệ thống.

## API Endpoints

### 1. Download Template Excel
```
GET /api/lecturers/template/download
```

**Mô tả**: Tải xuống file template Excel mẫu để import giảng viên

**Authorization**: Yêu cầu token JWT với role `admin` hoặc `training_officer`

**Response**: File Excel (.xlsx) với cấu trúc dữ liệu mẫu

### 2. Import Giảng viên từ Excel
```
POST /api/lecturers/import
```

**Mô tả**: Upload và import dữ liệu giảng viên từ file Excel

**Authorization**: Yêu cầu token JWT với role `admin` hoặc `training_officer`

**Content-Type**: `multipart/form-data`

**Body Parameters**:
- `excel_file` (file): File Excel chứa dữ liệu giảng viên

**Response Format**:
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

## Cấu trúc File Excel

### Các Cột Bắt Buộc
| Tên Cột | Kiểu Dữ Liệu | Mô Tả |
|----------|--------------|-------|
| `Mã giảng viên` | String (50) | Mã giảng viên (khóa chính) |
| `Họ tên` | String (50) | Họ và tên giảng viên |

### Các Cột Tùy Chọn
| Tên Cột | Kiểu Dữ Liệu | Mô Tả | Ví Dụ |
|----------|--------------|-------|-------|
| `Email` | String (70) | Email giảng viên | gv@university.edu.vn |
| `Ngày sinh` | Date | Ngày sinh | 1980-01-15 |
| `Giới tính` | String (30) | Giới tính | Nam/Nữ |
| `Địa chỉ` | String (100) | Địa chỉ | 123 Đường ABC, Quận 1 |
| `Số điện thoại` | String (20) | Số điện thoại | 0123456789 |
| `Khoa/Bộ môn` | String (100) | Khoa/Bộ môn | Khoa CNTT |
| `Ngày tuyển dụng` | Date | Ngày tuyển dụng | 2020-09-01 |
| `Học vị` | String (100) | Học vị | Tiến sỹ/Thạc sỹ |
| `Trạng thái` | String (30) | Trạng thái | active/inactive |

## Quy Tắc Validation

### 1. Dữ liệu bắt buộc
- `Mã giảng viên`: Không được rỗng, phải duy nhất
- `Họ tên`: Không được rỗng

### 2. Validation Email
- Email phải có định dạng hợp lệ
- Email phải duy nhất trong hệ thống

### 3. Validation Ngày tháng
- Hỗ trợ định dạng: YYYY-MM-DD, DD/MM/YYYY
- Hỗ trợ Excel date number

### 4. Kiểm tra trùng lặp
- `lecturer_id` không được trùng với dữ liệu đã có
- `email` không được trùng với dữ liệu đã có

## Xử Lý Lỗi

Hệ thống sẽ báo cáo chi tiết các lỗi theo từng dòng:

### Các Lỗi Thường Gặp
1. **"Mã giảng viên và Họ tên là bắt buộc"**: Thiếu thông tin bắt buộc
2. **"Email không đúng định dạng"**: Email không hợp lệ
3. **"Mã giảng viên đã tồn tại"**: lecturer_id đã có trong database
4. **"Email đã tồn tại"**: Email đã được sử dụng
5. **"Template không hợp lệ"**: File Excel thiếu cột bắt buộc

## Ví Dụ Sử Dụng

### 1. JavaScript/Fetch API
```javascript
// Download template
const downloadTemplate = async () => {
  const response = await fetch('/api/lecturers/template/download', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lecturer_template.xlsx';
  a.click();
};

// Import Excel
const importLecturers = async (file) => {
  const formData = new FormData();
  formData.append('excel_file', file);
  
  const response = await fetch('/api/lecturers/import', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const result = await response.json();
  console.log(result);
};
```

### 2. cURL
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

## Lưu Ý Quan Trọng

1. **Kích thước file**: Giới hạn 5MB cho mỗi file upload
2. **Định dạng file**: Chỉ chấp nhận .xlsx và .xls
3. **Encoding**: Đảm bảo file Excel sử dụng UTF-8 để hiển thị đúng tiếng Việt
4. **Performance**: Với file lớn (>1000 records), quá trình import có thể mất vài phút
5. **Transaction**: Import được thực hiện từng record, record lỗi sẽ bị bỏ qua

## Troubleshooting

### File upload failed
- Kiểm tra kích thước file (< 5MB)
- Đảm bảo định dạng file đúng (.xlsx, .xls)
- Kiểm tra token authorization

### Template validation failed
- Đảm bảo có đầy đủ cột bắt buộc: `Mã giảng viên`, `Họ tên`
- Tên cột phải viết đúng chính tả
- Không được có ký tự đặc biệt trong tên cột

### Import errors
- Kiểm tra dữ liệu theo quy tắc validation
- Đảm bảo lecturer_id và email duy nhất
- Kiểm tra định dạng ngày tháng

## Support

Nếu gặp vấn đề, vui lòng liên hệ team phát triển với thông tin:
- File Excel gốc
- Response message từ API
- Log lỗi (nếu có)
