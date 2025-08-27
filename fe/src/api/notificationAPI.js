import axiosInstance from "./axiosInstance"; // Giả sử đã có file axiosInstance.js

export const getNotificationsAPI = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/notifications", { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching notifications:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getNotificationByIdAPI = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/notifications/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error(`Error fetching notification with id ${id}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

export const markAsReadAPI = async (notificationIds) => {
  try {
    const response = await axiosInstance.post(
      `/api/notifications/mark-as-read`,
      { ids: notificationIds }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error marking notifications as read:", errorMessage);
    throw new Error(errorMessage);
  }
};
