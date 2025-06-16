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
