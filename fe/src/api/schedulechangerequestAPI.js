import axiosInstance from "./axiosConfig";

export const getAllScheduleChangeRequestsAPI = async () => {
    try {
        const response = await axiosInstance.get('/api/scheduleChangeRequests/getAll');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching schedule change requests:", error);
        throw error;
    }
};

export const createScheduleChangeRequestAPI = async (data) => {
    try {
        const response = await axiosInstance.post('/api/scheduleChangeRequests/create', data);
        return response.data;
    }
    catch (error) {
        console.error("Error creating schedule change request:", error);
        throw error;
    }
};

export const approveScheduleChangeRequestAPI = async (requestId) => {
    try {
        const response = await axiosInstance.put(`/api/scheduleChangeRequests/approve/${requestId}`);
        return response.data;
    }
    catch (error) {
        console.error("Error approving schedule change request:", error);
        throw error;
    }
};

export const rejectScheduleChangeRequestAPI = async (requestId, rejectionReason) => {
    try {
        const response = await axiosInstance.put(`/api/scheduleChangeRequests/reject/${requestId}`, {
            rejectionReason
        });
        return response.data;
    }
    catch (error) {
        console.error("Error rejecting schedule change request:", error);
        throw error;
    }
};


export const getScheduleChangeRequestByLecturerAPI = async (lecturerId) => {
    approveScheduleChangeRequestAPI
    try {
        const response = await axiosInstance.get(`/api/scheduleChangeRequests/lecturer/${lecturerId}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching schedule change requests by lecturer:", error);
        throw error;
    }
};