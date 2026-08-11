import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // Proxied by Vite in dev, handles same-origin in prod if served together
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global response error handler
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
