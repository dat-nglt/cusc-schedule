import StudentLayout from "../components/layout/StudentLayout/StudentLayout";
import ScheduleLayout from "../components/layout/ScheduleLayout/ScheduleLayout";
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";

const routes = [
  {
    path: "/dashboard",
    component: "Dashboard",
    exact: true,
    title: "Trình điều khiển",
    isPrivate: false,
<<<<<<< HEAD
    layout: ScheduleLayout,
  },
  {
=======
    layout: MainLayout,
  }, {
>>>>>>> 66a1362a00eaa404f4e3cf74422769c8c72a256a
    path: "/login",
    component: "LoginPage",
    exact: true,
    title: "Đăng nhập",
    isPrivate: false,
  },
  {
    path: "/auth/callback",
    component: "AuthCallback",
    exact: true,
    title: "Xử lý đăng nhập",
    isPrivate: false,
  },
  {
    path: "/profile",
    component: "ProfilePage",
    exact: true,
    title: "Hồ sơ cá nhân",
    isPrivate: false,
<<<<<<< HEAD
    layout: AdminLayout,
=======
    layout: MainLayout,
>>>>>>> 66a1362a00eaa404f4e3cf74422769c8c72a256a
  },
  {
    path: "/student",
    component: "StudentDashboard",
    exact: true,
    title: "Hồ sơ cá nhân",
    isPrivate: false,
    layout: StudentLayout,
  },
  {
    path: "/courses",
    component: "Course",
    exact: true,
    title: "Quản lý Khóa học",
    isPrivate: false,
    layout: AdminLayout,
  },
  {
    path: "/courses/add",
    component: "AddCourseModal",
    exact: true,
    title: "Thêm Khóa học",
    isPrivate: false,
    layout: MainLayout,
  },
  {
    path: "/courses/edit/:courseid",
    component: "EditCourseModal",
    exact: true,
    title: "Chỉnh sửa Khóa học",
    isPrivate: false,
    layout: MainLayout,
  },
  {
    path: "/slottime",
    component: "Slot_time",
    exact: true,
    title: "Quản lý Khung giờ",
    isPrivate: false,
    layout: AdminLayout,
  },
  {
    path: "/room",
    component: "Room",
    exact: true,
    title: "Quản lý Phòng học",
    isPrivate: false,
    layout: AdminLayout,
  },
  {
    path: "/class",
    component: "Class",
    exact: true,
    title: "Quản lý Lớp học",
    isPrivate: false,
    layout: AdminLayout,
  },
  {
    path: "/classsection",
    component: "ClassSection",
    exact: true,
    title: "Quản lý Lớp học phần",
    isPrivate: false,
    layout: AdminLayout,
  },
  {
    path: "/notification",
    component: "Notification",
    exact: false,
    title: "Thông báo",
    isPrivate: false,
    layout: MainLayout,
  },
  {
    path: "/lecturers",
    component: "Lecturer",
    exact: true,
    title: "Quản lý Giảng viên",
    isPrivate: false,
    layout: AdminLayout,
  },
  {
    path: "/students",
    component: "Student",
    exact: true,
    title: "Quản lý Học viên",
    isPrivate: false,
    layout: AdminLayout,
  },
  {
    path: "/subjects",
    component: "Subject",
    exact: true,
    title: "Quản lý Học phần",
    isPrivate: false,
    layout: AdminLayout,
  },
  {
    path: "/programs",
    component: "Program",
    exact: true,
    title: "Quản lý Chương trình đào tạo",
    isPrivate: false,
    layout: AdminLayout,
  },
  {
    path: "student/results",
    component: "StudentLearningResults",
    exact: true,
    title: "Kết quả học tập",
    isPrivate: false,
    layout: StudentLayout,
  },
  {
    path: "student/schedules",
    component: "StudentSchedules",
    exact: true,
    title: "Kết quả học tập",
    isPrivate: false,
    layout: StudentLayout,
  },
];

export default routes;
