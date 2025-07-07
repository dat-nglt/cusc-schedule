# Backend CUSC Schedule Management System

Dự án backend cho hệ thống quản lý thời khóa biểu của trường đại học CUSC (Can Tho University of Science and Technology). Được xây dựng với kiến trúc RESTful API hiện đại sử dụng Node.js, Express.js và PostgreSQL.

## 📋 Tổng Quan Hệ Thống

Backend này cung cấp một hệ thống quản lý thời khóa biểu toàn diện với các tính năng chính:

- **🔐 Quản lý Xác thực & Phân quyền**: Hệ thống JWT authentication với đa vai trò (Admin, Sinh viên, Giảng viên, Cán bộ đào tạo)
- **👥 Quản lý Người dùng**: CRUD operations cho tất cả loại người dùng trong hệ thống
- **📅 Quản lý Thời khóa biểu**: Tạo, cập nhật, xóa và truy vấn lịch học theo nhiều tiêu chí
- **📊 Quản lý Lịch thi**: Tổ chức và quản lý lịch thi cho các học kỳ
- **🔄 Đồng bộ Dữ liệu**: Hệ thống sync với các nguồn dữ liệu bên ngoài
- **🔔 Hệ thống Thông báo**: Gửi thông báo về thay đổi lịch học và lịch thi

## 🏗️ Kiến Trúc & Cấu Trúc Dự Án

```
be/
├── 📁 database/                # Database management với Sequelize
│   ├── config/
│   │   └── config.json        # Cấu hình database connections
│   ├── migrations/            # Database migrations (19 files)
│   │   ├── 20250603032154-create-users-table.js
│   │   ├── 20250603032947-create-training_officers-table.js
│   │   ├── 20250603033232-create-lecturers-table.js
│   │   ├── 20250603035707-create-students-table.js
│   │   ├── 20250603035757-create-admins-table.js
│   │   ├── 20250603035819-create-notifications-table.js
│   │   ├── 20250603040138-create-courses-table.js
│   │   ├── 20250603040147-create-classes-table.js
│   │   ├── 20250603040155-create-rooms-table.js
│   │   ├── 20250603040200-create-training_programs-table.js
│   │   ├── 20250603040213-create-semesters-table.js
│   │   ├── 20250603040222-create-subjects-table.js
│   │   ├── 20250603040233-create-class_sections-table.js
│   │   ├── 20250603040248-create-time_slots-table.js
│   │   ├── 20250603040300-create-break_schedule-table.js
│   │   ├── 20250603040312-create-class_schedules-table.js
│   │   ├── 20250603040324-create-exam_schedules-table.js
│   │   ├── 20250603040348-create-lecturer_assignments-table.js
│   │   └── 20250603040403-create-sync_histories-table.js
│   └── models/
│       └── index.js           # Sequelize models index
├── 📁 src/                    # Source code chính (ES6+ với Babel)
│   ├── 📁 config/            # Cấu hình ứng dụng
│   │   ├── cloudinary.js     # Cloudinary integration
│   │   ├── constants.js      # App constants & enums
│   │   └── database.js       # PostgreSQL connection với Sequelize
│   ├── 📁 controllers/       # Business logic controllers
│   │   ├── authController.js      # Authentication & Authorization ✅
│   │   ├── userController.js      # User management ✅
│   │   └── timetableController.js # Timetable management (commented)
│   ├── 📁 middleware/        # Express middleware
│   │   ├── authMiddleware.js      # JWT authentication middleware ✅
│   │   └── errorMiddleware.js     # Centralized error handling
│   ├── 📁 models/           # Sequelize data models
│   │   ├── User.js          # User model với bcrypt hashing ✅
│   │   └── Timetable.js     # Timetable model (commented out)
│   ├── 📁 routes/           # API route definitions
│   │   ├── authRoutes.js    # Authentication routes ✅
│   │   ├── userRoutes.js    # User management routes ✅
│   │   ├── timetableRoutes.js # Timetable routes (commented)
│   │   └── router.js        # Main router setup
│   ├── 📁 services/         # Business logic services
│   │   ├── authService.js   # JWT token generation & validation ✅
│   │   ├── userService.js   # User business logic ✅
│   │   └── timetableService.js # Timetable services (legacy)
│   ├── 📁 utils/            # Utility functions
│   │   ├── APIResponse.js   # Standardized API responses ✅
│   │   ├── logger.js        # Logging utilities
│   │   └── validation.js    # Input validation với express-validator ✅
│   ├── 📁 tests/            # Test suites (placeholder)
│   ├── server.js            # Application entry point ✅
│   └── .babelrc            # Babel configuration
├── 📄 package.json          # Dependencies & scripts
├── 📄 .sequelizerc         # Sequelize CLI configuration
├── 📄 console-env.js       # Environment testing utility
├── 📄 create_database.sql  # Database creation script
└── 📄 docs/                # API documentation (placeholder)
```

## 🗄️ Database Schema

Hệ thống quản lý **19 bảng dữ liệu** được thiết kế theo chuẩn quan hệ:

### 👤 **Quản lý Người dùng (User Management)**
- **users** - Thông tin người dùng cơ bản với JWT authentication
- **students** - Thông tin chi tiết sinh viên  
- **lecturers** - Thông tin giảng viên & chuyên môn
- **training_officers** - Cán bộ đào tạo & quyền hạn
- **admins** - Quản trị viên hệ thống

### 🎓 **Quản lý Học tập (Academic Management)**  
- **programs** - Chương trình đào tạo & ngành học
- **courses** - Khóa học theo chương trình
- **subjects** - Môn học & tín chỉ
- **classes** - Lớp học & sĩ số
- **class_sections** - Nhóm lớp & phân chia
- **semesters** - Học kỳ & năm học

### 📅 **Quản lý Thời khóa biểu (Schedule Management)**
- **rooms** - Phòng học & trang thiết bị
- **time_slots** - Khung giờ học chuẩn
- **class_schedules** - Lịch học hàng tuần
- **exam_schedules** - Lịch thi & giám sát
- **break_schedule** - Lịch nghỉ lễ, tết
- **lecturer_assignments** - Phân công giảng dạy

### 🔔 **Hệ thống (System)**
- **notifications** - Thông báo & alerts
- **sync_histories** - Lịch sử đồng bộ dữ liệu

## 🛠️ Tech Stack & Dependencies

### **Core Technologies**
- **Node.js** `20+` - JavaScript runtime environment
- **Express.js** `^5.1.0` - Web framework cho RESTful APIs
- **PostgreSQL** `14+` - Relational database management
- **Sequelize** `^6.37.7` - ORM/Query builder cho PostgreSQL

### **Authentication & Security**
- **JWT** `^9.0.2` - Token-based authentication
- **bcryptjs** `^3.0.2` - Password hashing với salt
- **express-validator** `^7.2.1` - Input validation & sanitization
- **CORS** `^2.8.5` - Cross-Origin Resource Sharing

### **Development Tools**
- **Babel** `^7.27.x` - ES6+ transpiler cho Node.js
- **Nodemon** `^3.1.10` - Auto-restart development server
- **Sequelize-CLI** `^6.6.3` - Database migration management

### **Utilities & Middleware**
- **dotenv** `^16.5.0` - Environment variables management
- **body-parser** `^2.2.0` - Request body parsing middleware
- **multer** `^2.0.1` - File upload handling
- **cloudinary** `^2.6.1` - Cloud-based image/file storage

## 🚀 Hướng Dẫn Cài Đặt & Deployment

### **1. Prerequisites**
Đảm bảo hệ thống đã cài đặt:
- **Node.js** `≥ 18.x` ([Download](https://nodejs.org/))
- **PostgreSQL** `≥ 14.x` ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### **2. Clone Repository**
```bash
git clone <repository-url>
cd cusc-schedule/be
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Environment Configuration**
Tạo file `.env` trong thư mục root và cấu hình:

```env
# 🗄️ Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cusc_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# 🔐 JWT Configuration  
JWT_SECRET=your_very_secure_jwt_secret_key_minimum_32_characters

# 🌐 Server Configuration
PORT=3000
NODE_ENV=development

# ☁️ Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **5. Database Setup**
```bash

#lệnh tạo config của sequelize migration
npx sequelize init
# code trong config
```bash
{
  "development": {
    "username": "postgres",
    "password": "MyPostgreSQL@2025",
    "database": "cusc_db",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "port": 5432
  }
}

# Tạo database PostgreSQL
psql -U postgres -c "CREATE DATABASE cusc_db;"

# Chạy migrations để tạo tables
npx sequelize-cli db:migrate

# Rollback migrations (nếu cần)
npx sequelize-cli db:migrate:undo:all
```

### **6. Run Application**
```bash
# 🔥 Development mode (auto-restart)
npm run dev

# 🚀 Production mode  
npm start

# 🔍 Check environment variables
npm run env
```

### **7. Verify Installation**
- Server sẽ chạy tại: `http://localhost:3000`
- Test API: `GET http://localhost:3000/api/auth/` (should return 404 - normal)
- Database connection được log trong console

## 📋 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `nodemon --exec babel-node src/server.js` | 🔥 Development server với hot-reload |
| `npm run env` | `node console-env.js` | 🔍 Kiểm tra environment variables |
| `npm test` | `echo "Error: no test specified"` | 🧪 Run tests (chưa implement) |

### **Migration Scripts**
```bash
# Tạo migration mới
npx sequelize-cli migration:generate --name migration-name

# Chạy migrations
npx sequelize-cli db:migrate

# Rollback migration gần nhất
npx sequelize-cli db:migrate:undo

# Rollback tất cả migrations  
npx sequelize-cli db:migrate:undo:all
```
### Chạy dữ liệu mẫu với seeders
```bash
#tạo seeder trong file seeders
npx sequelize-cli seed:generate --name <tên seeders>

#LƯU Ý CHỈNH SỬA DỮ LIỆU TRONG SEEDERS PHÙ HỢP VỚI 

#Chạy seeder
npx sequelize-cli db:seed:all

#Nếu muốn xóa seed
npx sequelize-cli db:seed:undo:all

```
## Trạng thái dự án

**Đã hoàn thành:**
- ✅ Cấu hình cơ bản Express.js với Babel
- ✅ Kết nối PostgreSQL với Sequelize
- ✅ Cấu trúc thư mục theo mô hình MVC
- ✅ Database migrations cho 20 bảng
- ✅ Hệ thống xác thực JWT hoàn chỉnh (login, register, logout)
- ✅ Mã hóa mật khẩu với bcryptjs
- ✅ JWT middleware cho bảo vệ routes
- ✅ Validation dữ liệu với express-validator
- ✅ API chuẩn hóa response format
- ✅ API cơ bản cho quản lý người dùng
- ✅ Middleware xử lý lỗi và CORS


**Đang phát triển:**
- 🔄 API cho thời khóa biểu (timetableController)
- 🔄 Unit tests và integration tests
- 🔄 API documentation với Swagger

**Chưa triển khai:**
- ❌ Database seeders
- ❌ Logging system hoàn chỉnh
- ❌ Rate limiting và security middleware
- ❌ Password reset functionality
- ❌ Cấu hình Cloudinary cho upload file

## API Endpoints

### Authentication APIs (✅ Đã hoàn thành)
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập hệ thống  
- `POST /api/auth/logout` - Đăng xuất (yêu cầu authentication)

### User Management APIs
- `GET /api/user/` - Lấy danh sách tất cả người dùng

### Đang phát triển:
- `/api/timetable/*` - Quản lý thời khóa biểu (chưa active)

**API base URL:** `http://localhost:3000/api`

### Cách sử dụng Authentication:

1. **Đăng ký:** 
   ```bash
   POST /api/auth/register
   Content-Type: application/json
   
   {
     "name": "Nguyễn Văn A",
     "email": "example@ctu.edu.vn", 
     "password": "password123"
   }
   ```

2. **Đăng nhập:**
   ```bash
   POST /api/auth/login
   Content-Type: application/json
   
   {
     "email": "example@ctu.edu.vn",
     "password": "password123"
   }
   ```

3. **Sử dụng token cho protected routes:**
   ```bash
   Authorization: Bearer <your_jwt_token>
   ```

## Lưu ý phát triển

1. **Database**: Đảm bảo PostgreSQL đang chạy trước khi start server
2. **Migration**: Luôn chạy migration sau khi pull code mới
3. **Environment**: File `.env` không được commit, cần tạo local và bao gồm JWT_SECRET
4. **JWT Secret**: Sử dụng secret key mạnh cho production (ít nhất 32 ký tự)
5. **Babel**: Dự án sử dụng ES6+ modules, cần Babel để transpile
6. **Hot reload**: Sử dụng `npm run dev` để auto-restart khi code thay đổi
7. **Password Security**: Mật khẩu được hash tự động bằng bcryptjs với salt rounds = 10
8. **Token Expiry**: JWT tokens hết hạn sau 1 giờ, frontend cần handle refresh

## Security Features

- ✅ **Password Hashing**: Sử dụng bcryptjs với salt rounds 10
- ✅ **JWT Authentication**: Token-based authentication với expiry
- ✅ **Input Validation**: Validate email format, password length, required fields  
- ✅ **Protected Routes**: Middleware kiểm tra JWT token
- ✅ **Error Handling**: Không expose sensitive info trong error responses
- ⏳ **Rate Limiting**: Chưa implement
- ⏳ **HTTPS**: Chưa configure cho production


# Authentication và Authorization Middleware

## Các middleware có sẵn:

### 1. `authMiddleware` (default export)
- Kiểm tra JWT token trong header Authorization
- Verify user có tồn tại trong database
- Đặt `req.userId`, `req.userRole`, `req.userInfo`

### 2. `requireRole(allowedRoles)`
- Phải sử dụng sau `authMiddleware`
- Kiểm tra user có role được phép không
- `allowedRoles` có thể là string hoặc array

### 3. `authenticateAndAuthorize(allowedRoles)`
- Kết hợp authenticate và authorize trong 1 middleware
- Được khuyến khích sử dụng

## Cách sử dụng:

### Cách 1: Sử dụng 2 middleware riêng biệt
```javascript
import authMiddleware, { requireRole } from '../middleware/authMiddleware.js';

// Chỉ admin mới được truy cập
router.get('/admin-only', authMiddleware, requireRole('admin'), controller);

// Admin hoặc training_officer được truy cập
router.get('/staff-only', authMiddleware, requireRole(['admin', 'training_officer']), controller);
```

### Cách 2: Sử dụng middleware kết hợp (Khuyến khích)
```javascript
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

// Chỉ admin mới được truy cập
router.get('/admin-only', authenticateAndAuthorize('admin'), controller);

// Admin hoặc training_officer được truy cập
router.get('/staff-only', authenticateAndAuthorize(['admin', 'training_officer']), controller);
```

## Các role có sẵn:
- `student` - Sinh viên
- `lecturer` - Giảng viên  
- `admin` - Quản trị viên
- `training_officer` - Cán bộ đào tạo

## Error codes:
- `401` - Chưa đăng nhập hoặc token không hợp lệ
- `403` - Đã đăng nhập nhưng không có quyền truy cập

## Test với Postman:

### 1. Login để lấy token:
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

### 2. Sử dụng token trong các request khác:
```
GET /api/users/getAll
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Test case cho role checking:
1. Login với tài khoản student
2. Gọi API `/api/users/getAll` (chỉ admin/training_officer được phép)
3. Kết quả mong đợi: 403 với message "Access denied. Required role: admin or training_officer, but user has role: student"



## Giấy Phép
Dự án này được cấp phép theo Giấy phép MIT. Xem file LICENSE để biết thêm chi tiết.


# Authentication System Documentation

## Tổng quan
Hệ thống authentication đã được cập nhật để hoạt động với các model riêng biệt thay vì model User tổng hợp.

## Models được hỗ trợ
- **Student**: Sinh viên với student_id
- **Lecturer**: Giảng viên với lecturer_id  
- **Admin**: Quản trị viên với admin_id
- **TrainingOfficer**: Cán bộ đào tạo với staff_id

## Chức năng Google OAuth

### Quy trình đăng nhập
1. User click "Login with Google"
2. Được chuyển hướng đến Google OAuth
3. Sau khi xác thực thành công, Google trả về profile
4. Hệ thống tìm kiếm user bằng google_id hoặc email
5. Nếu tìm thấy, cập nhật google_id và tạo JWT token
6. Nếu không tìm thấy, trả về lỗi (yêu cầu admin tạo account trước)

### Các endpoint

#### `GET /auth/google`
Khởi tạo Google OAuth flow

#### `GET /auth/google/callback`
Callback URL cho Google OAuth

#### `POST /auth/login`
Traditional login với email/password (nếu user có password)

#### `POST /auth/logout`
Logout (client-side remove token)

#### `GET /user/current`
Lấy thông tin user hiện tại

### JWT Token Structure
```json
{
  "id": "user_id", // student_id, lecturer_id, admin_id, hoặc staff_id
  "role": "student|lecturer|admin|training_officer",
  "iat": "issued_at_timestamp",
  "exp": "expiration_timestamp"
}
```

## Security Features

### Authentication Middleware
- Verify JWT token
- Check user existence in database
- Attach user info to request

### Role-based Authorization
```javascript
// Sử dụng requireRole middleware
router.get('/admin-only', authMiddleware, requireRole(['admin']), handler);
router.get('/staff-only', authMiddleware, requireRole(['admin', 'training_officer']), handler);
```

## User Service Functions

### `findUserByEmail(email)`
Tìm user trong tất cả models bằng email

### `findUserByGoogleId(googleId)`
Tìm user bằng google_id

### `findUserById(id)`
Tìm user bằng primary key

### `updateUserGoogleId(userInfo, googleId)`
Cập nhật google_id cho user

### `getUserId(userInfo)`
Lấy primary key của user từ userInfo object

## Lưu ý quan trọng

1. **Không auto-create user**: Hệ thống không tự động tạo user mới qua Google OAuth. Admin phải tạo user trước trong database.

2. **Email uniqueness**: Email phải unique trong toàn bộ hệ thống (không được trùng giữa các models).

3. **Google-only accounts**: User có thể chỉ dùng Google login (không có password).

4. **Role mapping**: Role được xác định dựa trên model chứa user:
   - Student → 'student'
   - Lecturer → 'lecturer'  
   - Admin → 'admin'
   - TrainingOfficer → 'training_officer'

## Environment Variables cần thiết

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cusc_db
DB_USER=postgres
DB_PASSWORD=MyPostgreSQL@2025

# 🔐 JWT Configuration  
JWT_SECRET=your_very_secure_jwt_secret_key_minimum_32_characters

# 🌐 Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5000

# ☁️ Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Login with Google OAuth (Optional)
GOOGLE_CLIENT_ID=801932636860-f35873dkek0gp2gf1ip3nkk08n8n3jej.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=supersecretkey
```

## Frontend Integration

Sau khi Google OAuth thành công, user sẽ được redirect về:
```
${FRONTEND_URL}/auth/callback?token=${jwt_token}&user=${user_info}
```

Frontend cần:
1. Parse token và user info từ URL
2. Store token trong localStorage/sessionStorage
3. Redirect user đến dashboard
4. Include token trong Authorization header cho các API calls:
   ```
   Authorization: Bearer ${token}
   ```

