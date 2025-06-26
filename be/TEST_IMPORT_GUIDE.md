# Test chức năng Import Giảng viên từ Excel

## Tạo file Excel test

### Tạo file mẫu với dữ liệu đúng:
```bash
cd be
node scripts/createTestExcel.js
```

### Tạo file test với lỗi:
```bash
cd be  
node scripts/createTestExcel.js error
```

## Test bằng cURL

### 1. Download template:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -o lecturer_template.xlsx \
     http://localhost:3000/api/lecturers/template
```

### 2. Import file Excel:
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "excel_file=@lecturer_sample_vietnamese.xlsx" \
  http://localhost:3000/api/lecturers/import
```

### 3. Test với file lỗi:
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "excel_file=@lecturer_error_test.xlsx" \
  http://localhost:3000/api/lecturers/import
```

## Expected Response

### Thành công:
```json
{
  "status": 200,
  "data": {
    "summary": {
      "total": 3,
      "success": 3,
      "errors": 0
    },
    "successRecords": [
      {
        "row": 2,
        "lecturer_id": "GV001",
        "name": "Nguyễn Văn A"
      },
      {
        "row": 3,
        "lecturer_id": "GV002", 
        "name": "Trần Thị B"
      },
      {
        "row": 4,
        "lecturer_id": "GV003",
        "name": "Lê Văn C"
      }
    ],
    "errorRecords": []
  },
  "message": "Import thành công 3 giảng viên"
}
```

### Có lỗi:
```json
{
  "status": 207,
  "data": {
    "summary": {
      "total": 3,
      "success": 1,
      "errors": 2
    },
    "successRecords": [
      {
        "row": 2,
        "lecturer_id": "GV004",
        "name": "Phạm Văn D"
      }
    ],
    "errorRecords": [
      {
        "row": 3,
        "lecturer_id": "N/A",
        "error": "Mã giảng viên và Họ tên là bắt buộc"
      },
      {
        "row": 4,
        "lecturer_id": "GV005",
        "error": "Mã giảng viên và Họ tên là bắt buộc"
      }
    ]
  },
  "message": "Import hoàn tất với 1/3 bản ghi thành công"
}
```

## Test Cases

### ✅ Valid Cases:
1. File với đầy đủ cột bắt buộc và tùy chọn
2. File chỉ có cột bắt buộc
3. File với các định dạng ngày khác nhau
4. File với dữ liệu Unicode (tiếng Việt có dấu)

### ❌ Error Cases:
1. File thiếu cột bắt buộc
2. File với email sai định dạng
3. File với mã giảng viên trùng lặp
4. File với email trùng lặp
5. File không phải Excel (.txt, .pdf, etc.)
6. File vượt quá 5MB
7. File Excel bị corrupt

## Manual Testing Steps

1. **Khởi động server:**
   ```bash
   cd be
   npm run dev
   ```

2. **Tạo file test:**
   ```bash
   node scripts/createTestExcel.js
   ```

3. **Test qua Postman/Insomnia:**
   - POST `/api/lecturers/import`
   - Body: form-data, key: `excel_file`, value: file Excel
   - Headers: `Authorization: Bearer YOUR_TOKEN`

4. **Test qua Frontend:**
   - Khởi động frontend: `cd fe && npm run dev`
   - Truy cập trang Lecturer Management
   - Click tab "Import Excel"
   - Test upload file

## Validation Checklist

- [ ] Template có tên cột tiếng Việt
- [ ] Import file với cột tiếng Việt thành công
- [ ] Validation "Mã giảng viên" và "Họ tên" bắt buộc
- [ ] Validation email format
- [ ] Validation trùng lặp mã giảng viên
- [ ] Validation trùng lặp email
- [ ] Xử lý định dạng ngày Excel
- [ ] Response có thông tin chi tiết lỗi
- [ ] Authentication required
- [ ] File size limit (5MB)
- [ ] File type validation (.xlsx, .xls only)
