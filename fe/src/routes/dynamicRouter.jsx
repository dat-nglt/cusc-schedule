// Import các module và component cần thiết
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "./routes"; // Import định nghĩa các route
import Loader from "../components/common/Loader"; // Component hiển thị khi đang tải
import NotFound from "../components/layout/NotFound"; // Component cho trang 404
import { useAuth } from "../hooks/useAuth"; // Hook kiểm tra trạng thái đăng nhập

// Import động tất cả các component từ thư mục `pages`
const pageComponents = import.meta.glob("../pages/*/index.jsx");

// Hàm tiện ích để thêm độ trễ khi tải component (cải thiện UX)
const lazyWithDelay = (loader, delay = 900) =>
    lazy(
        () =>
            new Promise((resolve) => {
                setTimeout(() => resolve(loader()), delay);
            })
    );

// Ánh xạ các component được import động với tên tương ứng
const lazyPages = Object.fromEntries(
    Object.entries(pageComponents).map(([key, loader]) => {
        const name = key.split("/").slice(-2, -1)[0]; // Lấy tên thư mục làm tên component
        return [name, lazyWithDelay(loader)];
    })
);

const DynamicRouter = () => {
    const { isAuthenticated } = useAuth(); // Kiểm tra người dùng đã đăng nhập hay chưa
    const location = useLocation(); // Lấy thông tin về route hiện tại

    useEffect(() => {
        const currentRoute = routes.find(
            (route) => location.pathname === route.path
        );
        document.title =
            currentRoute?.title || "Hệ Thống Quản Lý Thời Khóa Biểu"; // Đặt tiêu đề tab
    }, [location.pathname]);

    return (
        <Suspense fallback={<Loader />}> {/* Hiển thị loader khi đang tải component */}
            <Routes>
                {routes.map((route) => {
                    const Component = lazyPages[route.component] || NotFound; // Lấy component hoặc fallback về NotFound
                    const Layout = route.layout || React.Fragment; // Sử dụng layout tùy chỉnh hoặc mặc định là React.Fragment
                    const isPrivate = route.isPrivate; // Kiểm tra route có yêu cầu đăng nhập không

                    return (
                        <Route
                            key={route.path} // Khóa duy nhất cho mỗi route
                            path={route.path} // Đường dẫn của route
                            element={
                                isPrivate && !isAuthenticated ? ( // Chuyển hướng đến trang đăng nhập nếu route yêu cầu đăng nhập và người dùng chưa đăng nhập
                                    <Navigate to="/login" replace />
                                ) : (
                                    <Layout>
                                        <Component /> {/* Render component của route bên trong Layout */}
                                    </Layout>
                                )
                            }
                        />
                    );
                })}

                <Route path="*" element={<NotFound />} /> {/* Route fallback cho các đường dẫn không xác định */}
            </Routes>
        </Suspense>
    );
};

export default DynamicRouter;