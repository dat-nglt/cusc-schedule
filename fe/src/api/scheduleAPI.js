// web-app/frontend/src/api/apiService.js

import axiosInstance from "./axiosConfig";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getScheduledEntitiesAPI = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/schedule/get-data-filter-schedule"
    );
    return response.data;
  } catch (error) {
    console.error("Error in getDataForFilterSchedule:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw (
      error.response?.data ||
      new Error("An unknown error occurred while fetching input data.")
    );
  }
};

export const getInputDataForAlgorithmAPI = async () => {
  try {
    const response = await axiosInstance.get("/api/schedule/get-input-data");
    return response.data;
  } catch (error) {
    console.error("Error in getInputDataForAlgorithm:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw (
      error.response?.data ||
      new Error("An unknown error occurred while fetching input data.")
    );
  }
};

export const generateSchedule = async (scheduleData) => {
  try {
    const response = await axiosInstance.post(
      "/api/schedule/generate",
      scheduleData,
      {
        timeout: 30000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in scheduleApiService.generateSchedule:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw (
      error.response?.data ||
      new Error("An unknown error occurred during schedule generation.")
    );
  }
};

export const stopScheduleGeneration = async () => {
  try {
    const response = await axiosInstance.post(`/api/schedule/stop-ga`);
    return response.data;
  } catch (error) {
    console.error(
      "Error in stopScheduleGeneration API call:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const getDownloadUrl = (filename) => {
  return `${API_BASE_URL}/api/schedule/download/${filename}`;
};

export const saveGeneratedScheduleAPI = async () => {
  try {
    const response = await axiosInstance.post("/api/schedule/process-results");
    return response.data;
  } catch (error) {
    console.error("Error in saveGeneratedSchedule API call:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw (
      error.response?.data ||
      new Error("An unknown error occurred while saving the schedule.")
    );
  }
};
