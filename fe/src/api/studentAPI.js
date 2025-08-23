import axiosInstance from "./axiosConfig";

export const getAllStudentsAPI = async () => {
  try {
    const response = await axiosInstance.get("/api/students/getAll");
    return response.data;
  } catch (error) {
    console.error("Error getting students:", error);
    throw error;
  }
};

export const getStudentByIdAPI = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/students/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting student with id ${id}:`, error);
    throw error;
  }
};

export const createStudentAPI = async (studentData) => {
  try {
    const response = await axiosInstance.post(
      `/api/students/create`,
      studentData
    );
    return response;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

export const updateStudentAPI = async (id, studentData) => {
  try {
    const response = await axiosInstance.put(
      `/api/students/update/${id}`,
      studentData
    );
    return response;
  } catch (error) {
    console.error(`Error updating student with id ${id}:`, error);
    throw error;
  }
};

export const deleteStudentAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/students/delete/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting student with id ${id}:`, error);
    throw error;
  }
};

export const importStudentsAPI = async (jsonData) => {
  try {
    const response = await axiosInstance.post("/api/students/importJson", {
      students: jsonData,
    });
    return response;
  } catch (error) {
    console.error("Error importing students:", error);
    throw error;
  }
};
