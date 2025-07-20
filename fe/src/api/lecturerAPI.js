import axiosInstance from "./axiosConfig";

export const getAllLecturersAPI = async () => {
  try {
    const response = await axiosInstance.get("/api/lecturers/getAll");
    return response.data;
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    throw error;
  }
};

export const getLecturerByIdAPI = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/lecturers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lecturer by ID:", error);
    throw error;
  }
};

export const createLecturerAPI = async (lecturerData, subjectIds = []) => {
    try {
        const requestData = {
            ...lecturerData,
            subjectIds
        };
        const response = await axiosInstance.post('/api/lecturers/create', requestData);
        return response;
    }
    catch (error) {
        console.error('Error creating lecturer:', error);
        throw error;
    }
};

export const updateLecturer = async (id, lecturerData) => {
  try {
    const response = await axiosInstance.put(
      `/api/lecturers/update/${id}`,
      lecturerData
    );
    return response;
  } catch (error) {
    console.error("Error updating lecturer:", error);
    throw error;
  }
};

export const importLecturers = async (jsonData) => {
  try {
    // Import từ dữ liệu JSON đã được validate
    const response = await axiosInstance.post("/api/lecturers/importJson", {
      lecturers: jsonData,
    });
    return response;
  } catch (error) {
    console.error("Error importing lecturers:", error);
    throw error;
  }
};

export const deleteLecturer = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/lecturers/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    throw error;
  }
};
