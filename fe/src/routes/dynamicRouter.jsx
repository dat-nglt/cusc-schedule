// Import các module và component cần thiết
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Không cần Navigate ở đây nữa
import routes from "./routes"; // Import định nghĩa các route của bạn
import Loader from "../components/common/Loader"; // Component hiển thị khi đang tải
import NotFound from "../components/layout/NotFound"; // Component cho trang 404
import PrivateRoute from "./PrivateRoute"; // Đã có
import PublicRoute from "./PublicRoute"; // <-- Import PublicRoute mới
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const location = useLocation(); // Lấy thông tin về route hiện tại

    useEffect(() => {
        const currentRoute = routes.find(
            (route) => location.pathname === route.path
        );
        document.title =
            currentRoute?.title || "Hệ Thống Quản Lý Thời Khóa Biểu"; // Đặt tiêu đề tab
    }, [location.pathname]);

    return (
        // <Suspense fallback={<Loader />}> {/* Hiển thị loader khi đang tải component */}
        <Suspense > {/* Không hiển thị loader khi đang tải component */}
            <Routes>
                {routes.map((route) => {
                    const Component = lazyPages[route.component] || NotFound;
                    const Layout = route.layout || React.Fragment;
                    const isPrivate = route.isPrivate;
                    const allowedRoles = route.roles;
                    const isPublicRestricted = route.isPublicRestricted; // <-- Thêm thuộc tính mới

                    // Nội dung của route (component + layout + toast)
                    const routeContent = (
                        <Layout>
                            <Component />
                            <ToastContainer
                                position="bottom-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                limit={3}
                            />
                        </Layout>
                    );

                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                isPrivate ? (
                                    // Bảo vệ route riêng tư bằng PrivateRoute
                                    <PrivateRoute allowedRoles={allowedRoles}>
                                        {routeContent}
                                    </PrivateRoute>
                                ) : isPublicRestricted ? (
                                    // Bảo vệ route công khai (không cho người dùng đã đăng nhập vào) bằng PublicRoute
                                    <PublicRoute>
                                        {routeContent}
                                    </PublicRoute>
                                ) : (
                                    // Các route công khai khác mà mọi người đều có thể truy cập
                                    routeContent
                                )
                            }
                        />
                    );
                })}

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default DynamicRouter;