import LayoutJustHeader from "../components/layout/LayoutJustHeader";
import MainLayout from "../components/layout/MainLayout";

const routes = [
  {
    path: "/dashboard",
    component: "Dashboard",
    exact: true,
    title: "Trình điều khiển",
    isPrivate: false,
    layout: MainLayout,
  },
  {
    path: "/login",
    component: "LoginPage",
    exact: true,
    title: "Đăng nhập",
    isPrivate: false,
  },
  {
    path: "/profile",
    component: "ProfilePage",
    exact: true,
    title: "Hồ sơ cá nhân",
    isPrivate: true,
    layout: MainLayout,
  },
  {
    path: "/student",
    component: "StudentDashboard",
    exact: true,
    title: "Hồ sơ cá nhân",
    isPrivate: false,
    layout: LayoutJustHeader,
  },
  {
    path: "/courses",
    component: "Course",
    exact: true,
    title: "Quản lý Khóa học",
    isPrivate: false,
    layout: MainLayout,
  },
];

export default routes;