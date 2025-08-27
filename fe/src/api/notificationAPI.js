import axiosInstance from "./axiosConfig";


export const markAsReadAPI = async (notificationIds) => {
  try {
    const response = await axiosInstance.post(
      `/api/notifications/markAsRead`,
      { ids: notificationIds }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error marking notifications as read:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getUserNotificationsAPI = async () => {
  try {
    const response = await axiosInstance.get("/api/notifications/userNotifications");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching user notifications:", errorMessage);
    throw new Error(errorMessage);
  }
};
