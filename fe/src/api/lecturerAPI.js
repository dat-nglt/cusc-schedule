import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout for file upload
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const lecturerAPI = {
  // Get all lecturers
  getAll: () => {
    return api.get('/lecturers/getAll');
  },

  // Get lecturer by ID
  getById: (id) => {
    return api.get(`/lecturers/${id}`);
  },

  // Create new lecturer
  create: (lecturerData) => {
    return api.post('/lecturers/create', lecturerData);
  },

  // Update lecturer
  update: (id, lecturerData) => {
    return api.put(`/lecturers/update/${id}`, lecturerData);
  },

  // Delete lecturer
  delete: (id) => {
    return api.delete(`/lecturers/delete/${id}`);
  },
  // Download Excel template
  downloadTemplate: () => {
    return api.get('/lecturers/template', {
      responseType: 'blob', // Important for file download
    });
  },

  // Import lecturers from Excel
  importFromExcel: (formData) => {
    return api.post('/lecturers/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for import
    });
  },

  // Export lecturers to Excel (nếu cần thêm chức năng export)
  exportToExcel: (filters = {}) => {
    return api.get('/lecturers/export', {
      params: filters,
      responseType: 'blob',
    });
  },
};

export default lecturerAPI;
