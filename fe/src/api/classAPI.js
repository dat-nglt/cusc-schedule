import axiosInstance from "./axiosConfig";

// Lấy danh sách lớp học từ API
export const getClassesAPI = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/classes", { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching classes:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Lấy chi tiết lớp học theo ID
export const getClassByIdAPI = async (class_id) => {
  try {
    const response = await axiosInstance.get(`/api/classes/${class_id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching class detail:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Thêm lớp học mới
export const addClassAPI = async (classData) => {
  try {
    const response = await axiosInstance.post("/api/classes/add", classData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.log("Error adding class:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Cập nhật lớp học
export const updateClassAPI = async (class_id, classData) => {
  try {
    const response = await axiosInstance.put(
      `/api/classes/edit/${class_id}`,
      classData
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error updating class:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Xóa lớp học
export const deleteClassAPI = async (class_id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/classes/delete/${class_id}`
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error deleting class:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Lấy danh sách lớp học với bộ lọc
export const listClassesAPI = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/api/classes/list", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error listing classes:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Nhập lớp học từ file Excel hoặc dữ liệu JSON đã được validate
export const importClassesAPI = async (file, jsonData = null) => {
  try {
    let response;

    if (jsonData) {
      // Import từ dữ liệu JSON đã được validate
      response = await axiosInstance.post("/api/classes/importJson", {
        classes: jsonData,
      });
    } else if (file) {
      // Import từ file Excel
      const formData = new FormData();
      formData.append("excel_file", file);
      response = await axiosInstance.post("/api/classes/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      // Xử lý trường hợp không có dữ liệu đầu vào
      throw new Error(
        "Dữ liệu đầu vào không hợp lệ. Vui lòng cung cấp file hoặc dữ liệu JSON."
      );
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error importing classes:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Tải template Excel cho lớp học
export const downloadClassTemplateAPI = async () => {
  try {
    const response = await axiosInstance.get("/api/classes/template/download", {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error downloading class template:", errorMessage);
    throw new Error(errorMessage);
  }
};
