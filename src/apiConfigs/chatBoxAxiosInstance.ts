import axios from 'axios';
import { baseURL } from './axiosInstance';

const chatBoxAxiosInstance = axios.create({ baseURL });

chatBoxAxiosInstance.interceptors.request.use(
  (config) => {
    const XOrgId = localStorage.getItem('X-Org-Id');
    if (XOrgId) {
      config.headers['X-Org-Id'] = XOrgId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default chatBoxAxiosInstance;
