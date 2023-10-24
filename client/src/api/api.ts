import axios, { AxiosInstance } from 'axios';


const apiInstance: AxiosInstance = axios.create({
  baseURL: '/api',
});

apiInstance.interceptors.request.use(async config => {
  const store = await import ('../store');
  const token = store.default.getState().auth.token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default apiInstance;
