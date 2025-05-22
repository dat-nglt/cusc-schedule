# Đặc Tả Giao Diện Người Dùng

## 1. Giao Diện Dành Cho Quản Trị Viên (Admin)

### 1.1. Dashboard Tổng Quan
- **Mục đích**: Thống kê nhanh về số lớp, giảng viên, phòng học, xung đột chưa giải quyết.
- **Thành phần**:
  - Biểu đồ phân bổ lịch theo tuần/tháng.
  - Thông báo xung đột gần đây.
  - Nút truy cập nhanh: Tạo lịch, xuất báo cáo.

### 1.2. Tạo/Chỉnh Sửa Thời Khóa Biểu
- **Mục đích**: Nhập liệu và điều chỉnh lịch học.
- **Thành phần**:
  - **Form nhập liệu**:
    - Dropdown chọn lớp, môn, giảng viên, phòng.
    - Calendar picker chọn ngày/giờ.
  - **Bảng lịch dạng kéo thả**:
    - Hiển thị dạng timeline (thứ/giờ) với các slot môn học.
    - Kéo thả môn học để thay đổi giờ/phòng.
    - Highlight xung đột bằng màu đỏ.
  - **Nút chức năng**:
    - "Tạo tự động" (kích hoạt thuật toán GA/CSP).
    - "Lưu tạm" / "Xuất bản".

### 1.3. Quản Lý Tự Động Sắp Xếp Lịch
- **Mục đích**: Xem và chọn phương án lịch do hệ thống đề xuất.
- **Thành phần**:
  - **Bảng chọn ràng buộc ưu tiên**:
    - Checkbox: "Không học thứ 7", "Ưu tiên giảng viên chuyên ngành", v.v.
  - **Hiển thị phương án**:
    - 3-5 card lịch, mỗi card hiển thị điểm đánh giá (fitness score) và chi tiết.
  - Nút "Xem trước" để so sánh.
  - Nút "Áp dụng" để chọn lịch.

### 1.4. Báo Cáo Xung Đột
- **Mục đích**: Xem và xử lý xung đột.
- **Thành phần**:
  - Bảng danh sách xung đột (giảng viên trùng giờ, phòng trùng, v.v.).
  - Filter theo loại xung đột/trạng thái.
  - Nút "Gợi ý giải pháp" (tự động điều chỉnh lịch).

### 1.5. Quản Lý Người Dùng
- **Mục đích**: Thêm/sửa/xóa tài khoản và phân quyền.
- **Thành phần**:
  - Bảng danh sách người dùng (Admin, Giảng viên, Sinh viên).
  - Form thêm/sửa người dùng với dropdown chọn vai trò.
  - Toggle kích hoạt/vô hiệu hóa tài khoản.

### 1.6. Lịch Sử Thay Đổi (Audit Log)
- **Mục đích**: Theo dõi hoạt động hệ thống.
- **Thành phần**:
  - Bảng log với các cột: Thời gian, User, Hành động, IP.
  - Filter theo ngày/loại hành động.

## 2. Giao Diện Dành Cho Giảng Viên

### 2.1. Xem Lịch Giảng Dạy
- **Mục đích**: Theo dõi lịch dạy cá nhân.
- **Thành phần**:
  - Lịch tuần hiển thị các lớp đang dạy (dạng bảng hoặc timeline).
  - Nút "Yêu cầu thay đổi" (gửi request đến Admin).
  - Hiển thị cảnh báo xung đột (nếu có).

### 2.2. Cập Nhật Thông Tin
- **Mục đích**: Chỉnh sửa thông tin cá nhân và khung giờ đăng ký.
- **Thành phần**:
  - Form cập nhật chuyên ngành, khung giờ có thể dạy.
  - Nút "Gửi duyệt" để Admin phê duyệt.

## 3. Giao Diện Dành Cho Sinh Viên

### 3.1. Xem Lịch Học Lớp
- **Mục đích**: Tra cứu lịch học theo lớp.
- **Thành phần**:
  - Dropdown chọn lớp.
  - Bảng lịch học theo tuần (thứ/giờ/môn/phòng).
  - Nút "Xuất file PDF/Excel".

## 4. Giao Diện Chung

### 4.1. Đăng Nhập/Đăng Ký
- **Thành phần**:
  - Form nhập email/mật khẩu.
  - Link "Quên mật khẩu".
  - Phân loại vai trò (Admin/Giảng viên/Sinh viên) qua dropdown.

### 4.2. Xuất File và In Ấn
- **Thành phần**:
  - Popup chọn định dạng (PDF/Excel).
  - Tùy chọn phạm vi thời gian (tuần/tháng/học kỳ).
  - Xem trước trước khi tải/in.

### 4.3. Thông Báo Real-Time
- **Thành phần**:
  - Toast thông báo xung đột khi Admin/Giảng viên thay đổi lịch.
  - Popup cảnh báo khi lịch học sắp diễn ra (qua email và UI).

## 5. Thiết Kế UI/UX

### 5.1. Nguyên Tắc Thiết Kế
- **Responsive Layout**: Hiển thị tốt trên desktop/mobile.
- **Màu sắc**:
  - Xanh lá (thành công), Đỏ (xung đột), Cam (cảnh báo).
- **Tương tác**:
  - Tooltip giải thích ràng buộc khi hover.
  - Animation mượt khi kéo thả hoặc chuyển trang.

### 5.2. Thư Viện và Công Cụ
- **Frontend**:
  - React.js + Redux (state management).
  - Material-UI hoặc Ant Design (component library).
  - FullCalendar.js (hiển thị lịch).
  - React-PDF/ExcelJS (xuất file).
- **Backend**:
  - Swagger UI (tài liệu API).
  - Socket.io (real-time update).

## 6. Ví Dụ Wireframe

### 6.1. Trang Tạo Lịch (Admin)
```
+-------------------------------------------+
| [Dropdown lớp] [Dropdown môn] [Nút Tạo]  |
|                                           |
| +-----+-----+-----+-----+-----+-----+-----+
| | Thứ 2 | Thứ 3 | ... | Thứ 7 | Ca sáng  |
| +-----------------------------------------+
| | Toán  |       | ... |       |           |
| | Phòng A1      |     |       |           |
| +-----------------------------------------+
| [Nút Lưu] [Nút Xuất file] [Nút Auto-gen] |
+-------------------------------------------+
```

### 6.2. Trang Xem Lịch (Sinh Viên)
```
+-------------------------------------------+
| [Tìm kiếm lớp]                           |
| +-----------------------------------------+
| | Thứ 2: 08:00 - Toán - Phòng A1         |
| | Thứ 3: 10:00 - Lý - Phòng B2           |
| | ...                                     |
| +-----------------------------------------+
| [Nút Xuất PDF] [Nút In]                  |
+-------------------------------------------+
```

## 7. Yêu Cầu UX/UI Chi Tiết

### 7.1. Dashboard Tổng Quan (Admin)
- **UX**:
  - Hiển thị thông tin quan trọng ngay lập tức khi truy cập.
  - Sử dụng biểu đồ trực quan (dạng cột, tròn) để hiển thị phân bổ lịch.
  - Thông báo xung đột hiển thị nổi bật với màu đỏ và icon cảnh báo.
  - Nút truy cập nhanh được đặt ở vị trí dễ thấy, sử dụng màu sắc nổi bật.
- **UI**:
  - Biểu đồ sử dụng thư viện như Chart.js hoặc Recharts.
  - Thông báo xung đột hiển thị dưới dạng danh sách với icon và thời gian.
  - Nút "Tạo lịch" sử dụng màu xanh lá, "Xuất báo cáo" sử dụng màu xanh dương.

### 7.2. Tạo/Chỉnh Sửa Thời Khóa Biểu (Admin)
- **UX**:
  - Form nhập liệu đơn giản, dễ hiểu, các trường bắt buộc được đánh dấu rõ ràng.
  - Kéo thả môn học mượt mà, hiển thị thông báo khi xảy ra xung đột.
  - Nút "Tạo tự động" hiển thị tooltip giải thích chức năng.
- **UI**:
  - Form sử dụng Material-UI hoặc Ant Design với các thành phần như Dropdown, DatePicker.
  - Bảng lịch dạng timeline sử dụng FullCalendar.js.
  - Highlight xung đột bằng màu đỏ, tooltip hiển thị chi tiết xung đột khi hover.

### 7.3. Quản Lý Tự Động Sắp Xếp Lịch (Admin)
- **UX**:
  - Giao diện đơn giản, hiển thị rõ ràng các phương án lịch.
  - Cho phép so sánh các phương án trước khi áp dụng.
  - Hiển thị điểm đánh giá (fitness score) để người dùng dễ dàng lựa chọn.
- **UI**:
  - Card hiển thị phương án lịch với màu sắc phân biệt (xanh lá: tốt, cam: trung bình, đỏ: kém).
  - Nút "Xem trước" và "Áp dụng" đặt ở vị trí dễ thấy.

### 7.4. Báo Cáo Xung Đột (Admin)
- **UX**:
  - Bảng danh sách xung đột dễ lọc và tìm kiếm.
  - Gợi ý giải pháp hiển thị rõ ràng, dễ hiểu.
- **UI**:
  - Bảng sử dụng thư viện như Material-UI Table hoặc Ant Design Table.
  - Nút "Gợi ý giải pháp" sử dụng màu xanh lá, hiển thị modal với các tùy chọn giải pháp.

### 7.5. Quản Lý Người Dùng (Admin)
- **UX**:
  - Giao diện đơn giản, dễ dàng thêm/sửa/xóa người dùng.
  - Hiển thị cảnh báo khi vô hiệu hóa tài khoản.
- **UI**:
  - Form thêm/sửa người dùng sử dụng các thành phần như Input, Dropdown.
  - Toggle kích hoạt/vô hiệu hóa sử dụng switch với màu sắc phân biệt (xanh: kích hoạt, xám: vô hiệu hóa).

### 7.6. Xem Lịch Giảng Dạy (Giảng Viên)
- **UX**:
  - Lịch hiển thị rõ ràng, dễ dàng xem các lớp đang dạy.
  - Nút "Yêu cầu thay đổi" hiển thị nổi bật, dễ sử dụng.
- **UI**:
  - Lịch tuần sử dụng FullCalendar.js với các slot hiển thị chi tiết môn học, phòng học.
  - Cảnh báo xung đột hiển thị dưới dạng toast hoặc modal.

### 7.7. Xem Lịch Học Lớp (Sinh Viên)
- **UX**:
  - Dropdown chọn lớp dễ sử dụng, hiển thị danh sách lớp rõ ràng.
  - Nút "Xuất file PDF/Excel" hiển thị tooltip giải thích chức năng.
- **UI**:
  - Bảng lịch học sử dụng Material-UI Table hoặc Ant Design Table.
  - Nút "Xuất file" sử dụng icon và màu sắc nổi bật.

### 7.8. Đăng Nhập/Đăng Ký
- **UX**:
  - Form đơn giản, dễ sử dụng, hiển thị lỗi rõ ràng khi nhập sai.
  - Link "Quên mật khẩu" đặt ở vị trí dễ thấy.
- **UI**:
  - Form sử dụng Material-UI hoặc Ant Design với các thành phần như Input, Button.
  - Dropdown phân loại vai trò sử dụng icon để phân biệt (Admin, Giảng viên, Sinh viên).

### 7.9. Thông Báo Real-Time
- **UX**:
  - Thông báo hiển thị ngay lập tức khi có thay đổi.
  - Popup cảnh báo không làm gián đoạn trải nghiệm người dùng.
- **UI**:
  - Toast thông báo sử dụng thư viện như React-Toastify.
  - Popup cảnh báo sử dụng Material-UI Modal hoặc Ant Design Modal.

## Kết Luận
- **Ưu tiên**: Tập trung vào giao diện Admin (tạo lịch, xử lý xung đột) và giao diện xem lịch cho sinh viên.
- **Thử nghiệm**: A/B testing để tối ưu trải nghiệm drag-and-drop và filter.
- **Tài liệu**: Cung cấp video hướng dẫn sử dụng cho từng vai trò.