import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';
const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 6000,
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('aiInterviewToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const api = {
  get: async (url, config) => {
    return await apiClient.get(url, config);
  },
  post: async (url, data, config) => {
    const requestConfig = { ...(config || {}) };
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      requestConfig.headers = { ...(requestConfig.headers || {}) };
      delete requestConfig.headers['Content-Type'];
      delete requestConfig.headers['content-type'];
    }
    return await apiClient.post(url, data, requestConfig);
  },
};

export default api;
