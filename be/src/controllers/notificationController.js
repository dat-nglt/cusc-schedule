// src/controllers/notifications/index.js

// Hàm controller để lấy danh sách thông báo
export const getNotificationsController = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications(req.query);
    res.status(200).json({
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    next(error); // Chuyển lỗi đến middleware xử lý lỗi
  }
};

// Hàm controller để đánh dấu thông báo đã đọc
export const markNotificationsAsReadController = async (req, res, next) => {
  try {
    const { notificationIds } = req.body;
    if (
      !notificationIds ||
      !Array.isArray(notificationIds) ||
      notificationIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or empty notificationIds array" });
    }
    await notificationService.markNotificationsAsRead(notificationIds);
    res.status(200).json({
      message: "Notifications marked as read successfully",
    });
  } catch (error) {
    next(error);
  }
};
