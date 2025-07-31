import axiosInstance from "./axiosConfig";

export const getAllProgramsAPI = async () => {
  try {
    const response = await axiosInstance.get("/api/programs/getAll");
    return response;
  } catch (error) {
    console.error("Error fetching programs:", error);
    throw error;
  }
};

export const getProgramByIdAPI = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/programs/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching program with id ${id}:`, error);
    throw error;
  }
};

export const createProgramAPI = async (programData) => {
  try {
    const response = await axiosInstance.post(
      "/api/programs/create",
      programData
    );
    return response;
  } catch (error) {
    console.error("Error creating program:", error);
    throw error;
  }
};

export const updateProgramAPI = async (id, programData) => {
  try {
    const response = await axiosInstance.put(
      `/api/programs/update/${id}`,
      programData
    );
    return response;
  } catch (error) {
    console.error(`Error updating program with id ${id}:`, error);
    throw error;
  }
};

export const deleteProgramAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/programs/delete/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting program with id ${id}:`, error);
    throw error;
  }
};

export const importProgramsAPI = async (jsonData) => {
  try {
    const response = await axiosInstance.post("/api/programs/importJson", {
      programs: jsonData,
    });
    return response;
  } catch (error) {
    console.error("Error importing programs:", error);
    throw error;
  }
};
