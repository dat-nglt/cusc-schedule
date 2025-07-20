import StudentLayout from "../components/layout/StudentLayout/StudentLayout";
import ScheduleLayout from "../components/layout/ScheduleLayout/ScheduleLayout";
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";
import LecturerLayout from "../components/layout/LecturerLayout/LecturerLayout";

const routes = [
  // Route xử lý callback của Google OAuth.
  // Đây là trang trung gian, không cần private vì nó sẽ redirect nhanh chóng.
  {
    path: "/auth-callback",
    component: "AuthCallbackHandler", // Đảm bảo component này là AuthCallbackHandler, không phải Dashboard
    exact: true,
    title: "Đang xác thực...",
    isPrivate: false,
    layout: null, // Không có layout cụ thể cho trang này
  },
  // Trang Dashboard chung hoặc mặc định
  {
    path: "/dashboard",
    component: "Dashboard",
    exact: true,
    title: "Trình điều khiển",
    isPrivate: true, // Đặt là private
    roles: ["admin", "lecturer", "student"], // Mọi vai trò đều có thể vào dashboard
    layout: ScheduleLayout, // Giữ layout hiện tại
  },
  // Trang đăng nhập (luôn công khai)
  {
    path: "/login",
    component: "LoginPage",
    exact: true,
    title: "Đăng nhập",
    isPrivate: false,
    isPublicRestricted: true,
    layout: null, // Trang đăng nhập thường không có layout
  },
  // Route callback của Auth, nếu bạn có một endpoint riêng cho Passport.js callback
  // Thường thì /auth-callback (ở trên) là đủ cho frontend
  {
    path: "/auth/callback",
    component: "AuthCallback", // Component này có thể là một component không hiển thị gì nhiều
    exact: true,
    title: "Xử lý đăng nhập",
    isPrivate: false,
    layout: null,
  },
  // Trang hồ sơ cá nhân (thường là riêng tư)
  {
    path: "/profile",
    component: "ProfilePage",
    exact: true,
    title: "Hồ sơ cá nhân",
    isPrivate: true, // Riêng tư
    roles: ["admin", "lecturer", "student"], // Mọi người dùng đăng nhập đều có hồ sơ
    layout: AdminLayout, // Có thể cần thay đổi layout này tùy thuộc vào người dùng
  },

  // --- STUDENT ROUTES ---
  {
    path: "/student",
    component: "StudentDashboard",
    exact: true,
    title: "Bảng điều khiển sinh viên",
    isPrivate: true, // Riêng tư
    roles: ["admin", "student"], // Chỉ sinh viên
    layout: StudentLayout,
  },
  {
    path: "/student/results",
    component: "StudentLearningResults",
    exact: true,
    title: "Kết quả học tập",
    isPrivate: true, // Riêng tư
    roles: ["student"], // Chỉ sinh viên
    layout: StudentLayout,
  },
  {
    path: "/student/schedules",
    component: "StudentSchedules",
    exact: true,
    title: "Thời khóa biểu",
    isPrivate: true, // Riêng tư
    roles: ["student"], // Chỉ sinh viên
    layout: StudentLayout,
  },

  // --- ADMIN ROUTES ---
  // Các route quản lý này thường chỉ dành cho vai trò 'admin'
  {
    path: "/courses",
    component: "Course",
    exact: true,
    title: "Quản lý Khóa học",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/courses/add",
    component: "AddCourseModal", // Lưu ý: thường là modal, có thể không cần route riêng
    exact: true,
    title: "Thêm Khóa học",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/courses/edit/:courseid",
    component: "EditCourseModal", // Lưu ý: thường là modal
    exact: true,
    title: "Chỉnh sửa Khóa học",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/slottime",
    component: "Slot_time",
    exact: true,
    title: "Quản lý Khung giờ",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/room",
    component: "Room",
    exact: true,
    title: "Quản lý Phòng học",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/braekschedules",
    component: "BreakSchedule",
    exact: true,
    title: "Quản lý lịch nghỉ",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/class",
    component: "Class",
    exact: true,
    title: "Quản lý Lớp học",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/classsection",
    component: "ClassSection",
    exact: true,
    title: "Quản lý Lớp học phần",
    isPrivate: true, // Riêng tư
    roles: ["admin", "lecturer"], // Admin và Giảng viên
    layout: AdminLayout,
  },
  {
    path: "/notification",
    component: "Notification",
    exact: false, // Thường không exact để có thể có sub-routes như /notification/detail
    title: "Thông báo",
    isPrivate: true, // Riêng tư
    roles: ["admin", "lecturer", "student"], // Tất cả các vai trò
    layout: AdminLayout, // Có thể cần một layout chung cho thông báo
  },
  {
    path: "/lecturers",
    component: "Lecturer",
    exact: true,
    title: "Quản lý Giảng viên",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/semesters",
    component: "Semester",
    exact: true,
    title: "Quản lý học kỳ",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/students",
    component: "Student",
    exact: true,
    title: "Quản lý Học viên",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/subjects",
    component: "Subject",
    exact: true,
    title: "Quản lý Học phần",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },
  {
    path: "/programs",
    component: "Program",
    exact: true,
    title: "Quản lý Chương trình đào tạo",
    isPrivate: true, // Riêng tư
    roles: ["admin"], // Chỉ admin
    layout: AdminLayout,
  },

  // --- LECTURER ROUTES ---
  {
    path: "/lecturer",
    component: "LecturerDashboard",
    exact: true,
    title: "Tổng quan (Giảng viên)",
    isPrivate: true, // Riêng tư
    roles: ["lecturer"], // Chỉ giảng viên
    layout: LecturerLayout,
  },
  {
    path: "/lecturer/courses",
    component: "Course", // Có thể là Course riêng cho giảng viên, hoặc dùng chung component Course nhưng với data lọc
    exact: true,
    title: "Quản lý Khóa học của tôi",
    isPrivate: true, // Riêng tư
    roles: ["lecturer"], // Chỉ giảng viên
    layout: LecturerLayout,
  },
  {
    path: "/lecturer/schedule",
    component: "LecturerSchedule",
    exact: true,
    title: "Thời khóa biểu (Giảng viên)",
    isPrivate: true, // Riêng tư
    roles: ["lecturer"], // Chỉ giảng viên
    layout: LecturerLayout,
  },
  {
    path: "/lecturer/students",
    component: "Student", // Có thể là Student riêng cho giảng viên
    exact: true,
    title: "Danh sách sinh viên (Giảng viên)",
    isPrivate: true, // Riêng tư
    roles: ["lecturer"], // Chỉ giảng viên
    layout: LecturerLayout,
  },
  {
    path: "/lecturer/classsection",
    component: "ClassSection", // Có thể là ClassSection riêng cho giảng viên
    exact: true,
    title: "Thông tin cá nhân (Giảng viên)", // Title này có vẻ không khớp với component ClassSection
    isPrivate: true, // Riêng tư
    roles: ["lecturer"], // Chỉ giảng viên
    layout: LecturerLayout,
  },
  {
    path: "/lecturer/settings",
    component: "LecturerSettings",
    exact: true,
    title: "Cài đặt (Giảng viên)",
    isPrivate: true, // Riêng tư
    roles: ["lecturer"], // Chỉ giảng viên
    layout: LecturerLayout,
  },
];

export default routes;
