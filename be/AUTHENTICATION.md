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
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5000
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
