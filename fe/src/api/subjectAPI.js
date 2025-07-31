import axiosInstance from "./axiosConfig";

export const getAllSubjectsAPI = async () => {
  try {
    const response = await axiosInstance.get("/api/subjects/getAll");
    return response;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getSubjectByIdAPI = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/subjects/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching subject with ID ${id}:`, error);
    throw error;
  }
};

export const createSubjectAPI = async (subjectData) => {
  try {
    const response = await axiosInstance.post(
      "/api/subjects/create",
      subjectData
    );
    return response;
  } catch (error) {
    console.error("Error creating subject:", error);
    throw error;
  }
};

export const updateSubjectAPI = async (id, subjectData) => {
  try {
    const response = await axiosInstance.put(
      `/api/subjects/update/${id}`,
      subjectData
    );
    return response;
  } catch (error) {
    console.error(`Error updating subject with ID ${id}:`, error);
    throw error;
  }
};

export const deleteSubjectAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/subjects/delete/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting subject with ID ${id}:`, error);
    throw error;
  }
};

export const importSubjectAPI = async (jsonData) => {
  try {
    const response = await axiosInstance.post("/api/subjects/importJson", {
      subjects: jsonData,
    });
    return response;
  } catch (error) {
    console.error("Error importing subjects:", error);
    throw error;
  }
};
