# Sơ Đồ Thiết Kế Hệ Thống

## 1. Phân Tích Yêu Cầu

### Use Case Diagram
- **Mục đích**: Xác định actor và chức năng hệ thống
- **Thành phần chính**: Actor, Use Case, Relationships
- **Ví dụ ứng dụng**: Đăng nhập, Xem thời khóa biểu, Tạo lớp học

### User Story Mapping
- **Mục đích**: Phân nhóm yêu cầu theo người dùng
- **Thành phần chính**: Epics, User Stories, Tasks
- **Ví dụ ứng dụng**: Giáo viên: Upload file Excel -> Hệ thống parse file -> Lưu vào DB

### Activity Diagram
- **Mục đích**: Mô tả luồng xử lý nghiệp vụ
- **Thành phần chính**: Swimlanes, Actions, Decisions
- **Ví dụ ứng dụng**: Luồng phê duyệt thay đổi thời khóa biểu

## 2. Thiết Kế Hệ Thống

### ER Diagram (Entity-Relationship) - Đã thực hiện
- **Mục đích**: Thiết kế CSDL quan hệ
- **Thành phần chính**: Entities, Attributes, Relationships
- **Ví dụ ứng dụng**: Bảng timetables liên kết users (giáo viên) và classes

### Class Diagram - Đã thực hiện
- **Mục đích**: Mô hình hóa các lớp trong code
- **Thành phần chính**: Classes, Methods, Relationships
- **Ví dụ ứng dụng**: Lớp TimetableService phụ thuộc vào TimetableRepository

### Sequence Diagram
- **Mục đích**: Mô tả luồng tương tác giữa các thành phần
- **Thành phần chính**: Objects, Messages, Lifelines
- **Ví dụ ứng dụng**: Luồng API GET /timetables từ Controller -> Service -> Repository

### Component Diagram - Đã thực hiện
- **Mục đích**: Kiến trúc hệ thống tổng thể
- **Thành phần chính**: Components, Interfaces
- **Ví dụ ứng dụng**: Tương tác giữa Frontend React ↔ Backend API ↔ Database

### Data Flow Diagram (DFD)
- **Mục đích**: Luồng xử lý dữ liệu hệ thống
- **Thành phần chính**: Processes, Data Stores, Data Flows
- **Ví dụ ứng dụng**: Luồng xử lý file Excel từ upload -> validation -> lưu DB

## 3. Thiết Kế Cơ Sở Dữ Liệu

### Relational Schema - Đã thực hiện
- **Mục đích**: Chi tiết bảng và quan hệ
- **Thành phần chính**: Tables, Columns, Foreign Keys
- **Ví dụ ứng dụng**: Bảng timetables: id, class_id, teacher_id, schedule (JSON)

### Normalization Diagram
- **Mục đích**: Chuẩn hóa CSDL
- **Thành phần chính**: 1NF → 3NF
- **Ví dụ ứng dụng**: Tách bảng schedule_details từ timetables để đạt 3NF

### Query Optimization Plan
- **Mục đích**: Tối ưu truy vấn
- **Thành phần chính**: Execution Plans, Indexes
- **Ví dụ ứng dụng**: Giải thích truy vấn lấy thời khóa biểu theo tuần

## 4. Thiết Kế API

### OpenAPI/Swagger
- **Mục đích**: Đặc tả API endpoints
- **Thành phần chính**: Paths, Parameters, Schemas
- **Ví dụ ứng dụng**: GET /api/timetables?week=25

### State Diagram
- **Mục đích**: Trạng thái đối tượng nghiệp vụ
- **Thành phần chính**: States, Transitions
- **Ví dụ ứng dụng**: Trạng thái thời khóa biểu: Draft → Pending Approval → Published

### REST Resource Model
- **Mục đích**: Mô hình hóa tài nguyên API
- **Thành phần chính**: Resources, HTTP Verbs
- **Ví dụ ứng dụng**: Timetable: POST (create), PUT (update), GET (read)

## 5. Thiết Kế Giao Diện

### Wireframe
- **Mục đích**: Bố cục giao diện
- **Thành phần chính**: Components, Layout
- **Ví dụ ứng dụng**: Trang xem thời khóa biểu dạng lưới (7 ngày × 12 tiết)

### UI Flow Diagram
- **Mục đích**: Luồng điều hướng người dùng
- **Thành phần chính**: Screens, Transitions
- **Ví dụ ứng dụng**: Login → Dashboard → Calendar View → Detail Modal

## 6. Security & Infrastructure

### Threat Model
- **Mục đích**: Phân tích rủi ro bảo mật
- **Thành phần chính**: Assets, Threats, Mitigations
- **Ví dụ ứng dụng**: SQL Injection → Sử dụng ORM với parameterized queries

### Deployment Diagram
- **Mục đích**: Triển khai hệ thống
- **Thành phần chính**: Servers, Services, Networks
- **Ví dụ ứng dụng**: Frontend (Vercel) ↔ Backend (AWS EC2) ↔ DB (RDS PostgreSQL)

### Network Topology
- **Mục đích**: Kiến trúc mạng
- **Thành phần chính**: Firewalls, Load Balancers
- **Ví dụ ứng dụng**: Cấu hình VPC với public/private subnets

## 7. Đặc Tả Kỹ Thuật

### Architectural Decision Record (ADR)
- **Mục đích**: Ghi lại quyết định thiết kế
- **Thành phần chính**: Context, Decision, Consequences
- **Ví dụ ứng dụng**: Lựa chọn PostgreSQL thay vì MySQL cho JSONB support

### Domain Model
- **Mục đích**: Mô hình hóa domain nghiệp vụ
- **Thành phần chính**: Entities, Value Objects
- **Ví dụ ứng dụng**: Giáo viên ↔ Lớp học ↔ Môn học ↔ Phòng học

## Case Study Áp Dụng cho Dự Án

### Scenario: Thiết kế chức năng "Tạo thời khóa biểu"

#### ER Diagram:
```sql
CREATE TABLE timetables (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id),
  week_number INT NOT NULL,
  schedule JSONB NOT NULL -- {day: 'Monday', slots: [...]} 
);
```

#### Sequence Diagram:
- User -> Frontend: Nhập form
- Frontend -> API: POST /timetables
- API -> AuthMiddleware: Check JWT
- API -> Controller: createTimetable()
- Controller -> Service: validateData()
- Service -> Repository: saveToDB()
- Repository -> PostgreSQL: INSERT

#### UI Wireframe:
- Grid layout hiển thị theo tuần
- Drag-and-drop để sắp xếp tiết học
- Validation real-time khi xung đột lịch

## Công Cụ Đề Xuất
- **Database Design**: DbDiagram.io, MySQL Workbench
- **UML**: Lucidchart, PlantUML
- **API**: Swagger Editor, Postman
- **Wireframe**: Figma, Adobe XD
