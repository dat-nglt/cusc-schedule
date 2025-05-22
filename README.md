# cusc-schedule

## 1. Thiết lập cấu trúc thư mục backend (`be`)
- Tạo các thư mục và file cho backend: config, controllers, models, routes, services, middleware, utils, tests, docs, .env, app.js, package.json, README.md.
- Đảm bảo phân chia rõ ràng các thành phần: xử lý nghiệp vụ, xác thực, routes, schema, middleware, v.v.

## 2. Thiết lập cấu trúc thư mục frontend (`fe`)
- Tạo các thư mục và file cho frontend: public, src (api, assets, components, features, hooks, pages, routes, store, types, utils), .env, .eslintrc, .prettierrc, vite.config.js, package.json, README.md.
- Đổi tất cả các file TypeScript thành JavaScript.

## 3. Cấu hình script khởi động FE
- Đảm bảo script `dev` trong package.json chạy đúng với lệnh `npm run dev`.

## 4. Cấu hình Vite FE chạy port 5000
- Thêm cấu hình `server.port = 5000` trong `vite.config.js` để FE chạy tại http://localhost:5000.

## 5. Thiết lập tự động load route giao diện FE
- Tạo file `src/routes/autoRoutes.js` để tự động import các page trong `src/pages` và sinh route tương ứng.
- Cập nhật `src/routes/router.js` sử dụng `useRoutes` từ `react-router-dom` để tự động nhận routes từ `autoRoutes.js`.
- Cập nhật các file page (`HomePage`, `LoginPage`, `ProfilePage`, `TimetablePage`) thành component React cơ bản.
- Khi thêm mới page vào `src/pages`, hệ thống sẽ tự động nhận route mà không cần cấu hình thủ công.

## 6. Hướng dẫn chạy FE
- Cài đặt dependencies: `npm install`
- Chạy FE: `npm run dev`
- Truy cập: http://localhost:5000

## 7. Ghi chú
- Khi thêm mới page, chỉ cần tạo thư mục và file `index.js` trong `src/pages`, không cần sửa code router.
- Có thể mở rộng thêm các tính năng bảo vệ route, xác thực, v.v. trong các file liên quan.

## 8. Luồng xử lý route trong hệ thống

### Dynamic Routing
- Hệ thống sử dụng `dynamicRouter.jsx` để quản lý các route một cách linh hoạt.
- Các page được tự động import từ thư mục `src/pages`, mỗi page nằm trong một thư mục riêng và file chính là `index.jsx`.
- Các route được định nghĩa trong file `routes.js` với các thuộc tính:
  - `path`: Đường dẫn của route.
  - `component`: Tên component tương ứng với page.
  - `isPrivate`: Xác định route có cần bảo mật hay không.

### Lazy Loading
- Các page được tải bằng cơ chế lazy loading để tối ưu hiệu suất.
- Sử dụng `React.Suspense` để hiển thị loader trong khi chờ tải page.

### Private Route
- Các route được đánh dấu `isPrivate: true` sẽ được bảo vệ bằng `PrivateRoute`.
- `PrivateRoute` kiểm tra trạng thái xác thực thông qua hook `useAuth`.
- Nếu người dùng chưa xác thực, họ sẽ được chuyển hướng đến trang `/login`.

### Cách thêm mới route
1. Tạo thư mục mới trong `src/pages` với tên tương ứng với page.
2. Tạo file `index.jsx` trong thư mục đó và định nghĩa component của page.
3. Thêm route mới vào `routes.js` với các thuộc tính `path`, `component`, và `isPrivate`.

### Ví dụ cấu hình route trong `routes.js`
```javascript
const routes = [
  {
    path: '/',
    component: 'HomePage',
    isPrivate: false,
  },
  {
    path: '/login',
    component: 'LoginPage',
    isPrivate: false,
  },
  {
    path: '/profile',
    component: 'ProfilePage',
    isPrivate: true,
  },
];

export default routes;
```

### Kết quả
- Hệ thống tự động nhận diện và render các route từ cấu hình trong `routes.js`.
- Các route bảo mật sẽ được kiểm tra xác thực trước khi hiển thị nội dung.

## 9. Các tác vụ đã thực hiện ngày 22/05/2025

### 1. Thiết kế và cập nhật giao diện
- **Header**:
  - Thêm logo hoặc tên hệ thống ở bên trái.
  - Hiển thị tiêu đề trang ở giữa.
  - Thêm hai nút truy cập nhanh: "Tạo lịch" (màu xanh lá) và "Xuất báo cáo" (màu xanh dương) ở bên phải.
  - Thiết kế dạng sticky để luôn hiển thị khi người dùng cuộn trang.

- **MainLayout**:
  - Cập nhật để nhận `children` làm prop, cho phép render các thành phần được truyền từ `DynamicRouter`.

### 2. Thiết kế theme cho hệ thống
- Tạo file `theme.js` để định nghĩa các màu sắc cơ bản cho giao diện sáng và tối:
  - **Primary Color**: Xanh dương nhạt (#3B82F6).
  - **Secondary Color**: Cam nhạt (#F59E0B).
  - **Background**: Trắng ngà (#F9FAFB) và xám rất nhạt (#F3F4F6).
  - **Text**: Xám đậm (#111827), xám trung bình (#374151), xám nhạt (#6B7280).
  - **Trạng thái**: Thành công (xanh lá #10B981), cảnh báo (vàng #FACC15), lỗi (đỏ #EF4444).
- Tích hợp theme vào hệ thống thông qua `ThemeProvider` trong `App.jsx`.

### 3. Tối ưu hóa thanh cuộn (Scrollbar)
- Tùy chỉnh thanh cuộn toàn hệ thống trong `GlobalStyle.js`:
  - Làm cho thanh cuộn nhỏ hơn.
  - Thêm màu sắc và bo tròn để tăng tính thẩm mỹ.

### 4. Cập nhật ESLint
- Cấu hình ESLint để bỏ qua cảnh báo khi không sử dụng `setState` trong `useState`.

### 5. Cải thiện luồng xử lý route
- **DynamicRouter**:
  - Thêm chú thích chi tiết bằng tiếng Việt để giải thích từng phần của mã.
  - Đảm bảo các thành phần được bọc bên trong `MainLayout` để hỗ trợ `Outlet`.

### 6. Thiết kế lịch tuần (WeeklyCalendar)
- Tạo component `WeeklyCalendar` với các tính năng:
  - Hiển thị lịch tuần với các ngày và khung giờ.
  - Tích hợp giao diện responsive cho desktop và mobile.
  - Sử dụng `react-dnd` để hỗ trợ kéo thả.

### 7. Hướng dẫn chạy hệ thống
- Cài đặt dependencies: `npm install`.
- Chạy hệ thống: `npm run dev`.
- Truy cập: `http://localhost:5000`.
````
