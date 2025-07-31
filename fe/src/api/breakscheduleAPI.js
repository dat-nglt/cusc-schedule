import axiosInstance from "./axiosConfig";

// Lấy danh sách lịch nghỉ từ API
export const getBreakSchedulesAPI = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/breakschedules", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching break schedules:",
      error.response?.data || error.message
    );
    throw new Error(
      "Error fetching break schedules: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Lấy chi tiết lịch nghỉ theo ID
export const getBreakScheduleByIdAPI = async (break_id) => {
  try {
    const response = await axiosInstance.get(`/api/breakschedules/${break_id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching break schedule detail:",
      error.response?.data || error.message
    );
    throw new Error(
      "Error fetching break schedule detail: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Thêm lịch nghỉ mới
export const addBreakScheduleAPI = async (breakScheduleData) => {
  try {
    const response = await axiosInstance.post(
      "/api/breakschedules/add",
      breakScheduleData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error adding break schedule:",
      error.response?.data || error.message
    );
    throw new Error(
      "Error adding break schedule: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Cập nhật lịch nghỉ
export const updateBreakScheduleAPI = async (break_id, breakScheduleData) => {
  try {
    const response = await axiosInstance.put(
      `/api/breakschedules/edit/${break_id}`,
      breakScheduleData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating break schedule:",
      error.response?.data || error.message
    );
    throw new Error(
      "Error updating break schedule: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Xóa lịch nghỉ
export const deleteBreakScheduleAPI = async (break_id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/breakschedules/delete/${break_id}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting break schedule:",
      error.response?.data || error.message
    );
    throw new Error(
      "Error deleting break schedule: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Lấy danh sách lịch nghỉ với bộ lọc (tương ứng với route rỗng '')
export const listBreakSchedulesAPI = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/api/breakschedules", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error listing break schedules:",
      error.response?.data || error.message
    );
    throw new Error(
      "Error listing break schedules: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Nhập lịch nghỉ từ file Excel hoặc dữ liệu JSON đã được validate
export const importBreakSchedulesAPI = async (file, jsonData = null) => {
  try {
    if (jsonData) {
      // Import từ dữ liệu JSON đã được validate
      const response = await axiosInstance.post(
        "/api/breakschedules/importJson",
        {
          breakSchedules: jsonData,
        }
      );
      return response;
    } else {
      // Import từ file Excel
      const formData = new FormData();
      formData.append("excel_file", file);

      const response = await axiosInstance.post(
        "/api/breakschedules/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    }
  } catch (error) {
    console.error("Error importing break schedules:", error);
    throw new Error("Lỗi khi nhập lịch nghỉ từ tệp");
  }
};
