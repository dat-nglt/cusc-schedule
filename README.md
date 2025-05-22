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