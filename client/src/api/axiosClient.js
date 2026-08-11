import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // Proxied by Vite in dev, handles same-origin in prod if served together
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
axiosClient.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle global 401s (e.g., dispatch logout if token expires)
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('userInfo');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
