// Import các module và component cần thiết
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes"; // Import định nghĩa các route
import Loader from "../components/common/Loader"; // Component hiển thị khi đang tải
import NotFound from "../components/layout/NotFound"; // Component cho trang 404
import { useAuth } from "../hooks/useAuth"; // Hook kiểm tra trạng thái đăng nhập
import MainLayout from "../components/layout/MainLayout"; // Layout chính của ứng dụng

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

    return (
        <Suspense fallback={<Loader />}> {/* Hiển thị loader khi đang tải component */}
            <Routes>
                {routes.map((route) => {
                    const Component = lazyPages[route.component] || NotFound; // Lấy component hoặc fallback về NotFound
                    const isPrivate = route.isPrivate; // Kiểm tra route có yêu cầu đăng nhập không

                    return (
                        <Route
                            key={route.path} // Khóa duy nhất cho mỗi route
                            path={route.path} // Đường dẫn của route
                            element={
                                isPrivate && !isAuthenticated ? ( // Chuyển hướng đến trang đăng nhập nếu route yêu cầu đăng nhập và người dùng chưa đăng nhập
                                    <Navigate to="/login" replace />
                                ) : (
                                    <MainLayout>
                                        <Component /> {/* Render component của route bên trong MainLayout */}
                                    </MainLayout>
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