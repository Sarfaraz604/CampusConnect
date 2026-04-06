// src/utils/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_backend_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Optional: Add request/response interceptors for logging and error handling
axiosInstance.interceptors.request.use(
  config => {
    console.log('Axios Request:', {
      url: config.url,
      method: config.method
    });
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;