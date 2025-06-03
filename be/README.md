# README cho Dự án Backend CUSC Schedule

Dự án này là một ứng dụng backend được thiết kế để quản lý hệ thống thời khóa biểu cho trường đại học CUSC (Can Tho University of Science and Technology). Được xây dựng với kiến trúc RESTful API sử dụng Node.js, Express.js và PostgreSQL.

## Tổng Quan Backend

Backend này được xây dựng để hỗ trợ hệ thống quản lý thời khóa biểu toàn diện của trường đại học. Hệ thống cung cấp các API RESTful để xử lý:

- **Quản lý người dùng**: Hệ thống đa vai trò bao gồm sinh viên, giảng viên, cán bộ đào tạo và quản trị viên
- **Quản lý thời khóa biểu**: Tạo, cập nhật, xóa và truy vấn thời khóa biểu theo lớp, môn học và phòng học
- **Quản lý lịch thi**: Tổ chức và quản lý lịch thi cho các kỳ học
- **Đồng bộ dữ liệu**: Hệ thống sync với các nguồn dữ liệu bên ngoài
- **Thông báo**: Gửi thông báo về thay đổi lịch học và lịch thi

## Cấu Trúc Dự Án

```
be/
├── config/                    # Cấu hình Sequelize CLI
│   └── config.json           # Cấu hình kết nối database
├── src/                      # Source code chính
│   ├── config/              # Cấu hình ứng dụng
│   │   ├── cloudinary.js    # Cấu hình Cloudinary cho upload file
│   │   ├── constants.js     # Hằng số ứng dụng
│   │   └── database.js      # Cấu hình kết nối PostgreSQL với Sequelize
│   ├── controllers/         # Xử lý logic cho các API endpoints
│   │   ├── authController.js     # Xác thực và phân quyền
│   │   ├── timetableController.js # Quản lý thời khóa biểu
│   │   └── userController.js     # Quản lý người dùng
│   ├── middleware/          # Middleware cho xử lý request/response
│   │   ├── authMiddleware.js     # Kiểm tra xác thực JWT
│   │   └── errorMiddleware.js    # Xử lý lỗi tập trung
│   ├── models/              # Định nghĩa schema dữ liệu Sequelize
│   │   ├── User.js          # Model người dùng
│   │   └── Timetable.js     # Model thời khóa biểu
│   ├── routes/              # Định nghĩa các API endpoints
│   │   ├── authRoutes.js    # Routes cho xác thực
│   │   ├── timetableRoutes.js # Routes cho thời khóa biểu
│   │   ├── userRoutes.js    # Routes cho quản lý người dùng
│   │   └── router.js        # Router tổng hợp
│   ├── services/            # Business logic layer
│   │   ├── authService.js   # Logic xác thực
│   │   ├── timetableService.js # Logic thời khóa biểu
│   │   └── userService.js   # Logic quản lý người dùng
│   ├── utils/               # Utility functions
│   │   ├── APIResponse.js   # Chuẩn hóa phản hồi API
│   │   ├── logger.js        # Logging system
│   │   └── validation.js    # Validation helpers
│   ├── tests/               # Unit tests và integration tests
│   └── server.js            # Entry point của ứng dụng
├── migrations/              # Database migrations (Sequelize)
│   ├── 20250603032154-create-users-table.js
│   ├── 20250603032947-create-training_officers-table.js
│   ├── 20250603033232-create-lecturers-table.js
│   ├── 20250603035707-create-students-table.js
│   ├── 20250603035757-create-admins-table.js
│   ├── 20250603035819-create-notifications-table.js
│   ├── 20250603040138-create-courses-table.js
│   ├── 20250603040147-create-classes-table.js
│   ├── 20250603040155-create-rooms-table.js
│   ├── 20250603040200-create-training_programs-table.js
│   ├── 20250603040213-create-semesters-table.js
│   ├── 20250603040222-create-subjects-table.js
│   ├── 20250603040233-create-class_sections-table.js
│   ├── 20250603040248-create-time_slots-table.js
│   ├── 20250603040300-create-break_schedule-table.js
│   ├── 20250603040312-create-class_schedules-table.js
│   ├── 20250603040324-create-exam_schedules-table.js
│   ├── 20250603040348-create-lecturer_assignments-table.js
│   └── 20250603040403-create-sync_histories-table.js
├── models/                  # Sequelize models index
│   └── index.js
├── seeders/                 # Database seeders (đang trống)
├── docs                     # Tài liệu API (chưa triển khai)
├── .env                     # Biến môi trường
├── package.json             # Dependencies và scripts
└── create_database.sql      # SQL script tạo database
```

## Database Schema

Hệ thống quản lý 20 bảng chính bao gồm:

### Quản lý người dùng:
- **users**: Thông tin người dùng cơ bản
- **students**: Thông tin sinh viên
- **lecturers**: Thông tin giảng viên  
- **training_officers**: Cán bộ đào tạo
- **admins**: Quản trị viên hệ thống

### Quản lý học tập:
- **training_programs**: Chương trình đào tạo
- **courses**: Khóa học
- **subjects**: Môn học
- **classes**: Lớp học
- **class_sections**: Nhóm lớp
- **semesters**: Học kỳ

### Quản lý thời khóa biểu:
- **rooms**: Phòng học
- **time_slots**: Khung giờ học
- **class_schedules**: Lịch học lớp
- **exam_schedules**: Lịch thi
- **break_schedule**: Lịch nghỉ
- **lecturer_assignments**: Phân công giảng dạy

### Hệ thống:
- **notifications**: Thông báo
- **sync_histories**: Lịch sử đồng bộ

## Công Nghệ Sử Dụng

- **Node.js**: Môi trường runtime JavaScript phía server
- **Express.js**: Framework web cho Node.js
- **PostgreSQL**: Cơ sở dữ liệu quan hệ
- **Sequelize**: ORM/Query builder cho PostgreSQL
- **Babel**: Transpiler ES6+ JavaScript
- **Cloudinary**: Dịch vụ lưu trữ và xử lý hình ảnh
- **CORS**: Xử lý Cross-Origin Resource Sharing
- **Dotenv**: Quản lý biến môi trường
- **Body-parser**: Middleware xử lý request body
- **Nodemon**: Auto-restart server khi development

## Hướng Dẫn Cài Đặt

1. **Clone repository**:
   ```
   git clone <repository-url>
   cd be
   ```

2. **Cài đặt dependencies**:
   ```
   npm install
   ```

3. **Cấu hình biến môi trường**:
   Tạo file `.env` trong thư mục gốc và thêm các biến môi trường cần thiết:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cusc_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Cloudinary Configuration (nếu sử dụng)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Tạo database và chạy migration**:
   ```bash
   # Tạo database PostgreSQL (nếu chưa có)
   psql -U postgres -c "CREATE DATABASE cusc_db;"
   
   # Chạy migration để tạo các bảng
   npx sequelize-cli db:migrate
   
   # Hoặc sử dụng npm script
   npm run migrate
   
   # Rollback migration (nếu cần)
   npx sequelize-cli db:migrate:undo:all
   ```

5. **Chạy ứng dụng**:
   ```bash
   # Development mode với auto-restart
   npm run dev
   
   # Production mode
   npm start
   
   # Kiểm tra biến môi trường
   npm run env
   ```

## Scripts có sẵn

- `npm start`: Chạy server production với Babel
- `npm run dev`: Chạy server development với nodemon và auto-restart
- `npm run env`: Kiểm tra biến môi trường
- `npm test`: Chạy tests (chưa cấu hình)

## Trạng thái dự án

**Đã hoàn thành:**
- ✅ Cấu hình cơ bản Express.js với Babel
- ✅ Kết nối PostgreSQL với Sequelize
- ✅ Cấu trúc thư mục theo mô hình MVC
- ✅ Database migrations cho 20 bảng
- ✅ API cơ bản cho quản lý người dùng
- ✅ Middleware xử lý lỗi và CORS
- ✅ Cấu hình Cloudinary cho upload file

**Đang phát triển:**
- 🔄 API cho thời khóa biểu (timetableController)
- 🔄 API cho xác thực (authController)
- 🔄 Validation và error handling
- 🔄 Unit tests và integration tests

**Chưa triển khai:**
- ❌ JWT authentication middleware
- ❌ API documentation (Swagger/OpenAPI)
- ❌ Database seeders
- ❌ Logging system hoàn chỉnh
- ❌ Rate limiting và security middleware

## API Endpoints

**Hiện tại chỉ có:**
- `GET /api/user/` - Lấy danh sách tất cả người dùng

**Đang phát triển:**
- `/api/auth/*` - Xác thực và phân quyền (chưa active)
- `/api/timetable/*` - Quản lý thời khóa biểu (chưa active)

Để biết thông số kỹ thuật API chi tiết, tham khảo thư mục `docs/` (đang được phát triển).

**API base URL:** `http://localhost:3000/api`

## Lưu ý phát triển

1. **Database**: Đảm bảo PostgreSQL đang chạy trước khi start server
2. **Migration**: Luôn chạy migration sau khi pull code mới
3. **Environment**: File `.env` không được commit, cần tạo local
4. **Babel**: Dự án sử dụng ES6+ modules, cần Babel để transpile
5. **Hot reload**: Sử dụng `npm run dev` để auto-restart khi code thay đổi



## Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT. Xem file LICENSE để biết thêm chi tiết.

