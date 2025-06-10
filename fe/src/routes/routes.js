import LayoutJustHeader from "../components/layout/LayoutJustHeader";
import MainLayout from "../components/layout/MainLayout"; // Import MainLayout

const routes = [
  {
    path: "/dashboard",
    component: "Dashboard",
    exact: true,
    title: "Trình điều khiển",
    isPrivate: false,
    layout: MainLayout, // Sử dụng layout MainLayout
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
    isPrivate: false,
    layout: MainLayout, // Sử dụng layout MainLayout
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
    path: "student/results",
    component: "StudentLearningResults",
    exact: true,
    title: "Kết quả học tập",
    isPrivate: false,
    layout: LayoutJustHeader,
  },
  {
    path: "student/schedules",
    component: "StudentSchedules",
    exact: true,
    title: "Kết quả học tập",
    isPrivate: false,
    layout: LayoutJustHeader,
  },
];

export default routes;
