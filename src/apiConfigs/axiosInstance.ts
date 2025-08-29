import { AuthService } from '@/services/auth/auth';
import axios from 'axios';

export const baseURL = 'http://192.168.1.68:8000';
// export const baseURL = 'https://api.chatboq.com';
// export const baseURL = 'http://127.0.0.1:8000';
// export const baseURL = 'https://df3bkw8f-8000.inc1.devtunnels.ms';

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};

let failedQueue: FailedRequest[] = [];
let isRefreshing = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(
  (config) => {
    const XOrgId = localStorage.getItem('X-Org-Id');
    const tokens = AuthService.getAuthTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    // console.log(`x org id in header: ${XOrgId}`);
    if (XOrgId) {
      config.headers['X-Org-Id'] = XOrgId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('Orginal request', originalRequest);

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    isRefreshing = true;

    const tokens = AuthService.getAuthTokens();
    if (!tokens?.refreshToken) {
      AuthService.clearAuthTokens();
      window.location.href = '/login';
      return Promise.reject(new Error('No refresh token available'));
    }

    try {
      const newAccessToken = await AuthService.refreshAccessToken(
        tokens.refreshToken,
      );

      console.log('Access tokens', newAccessToken);

      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (err) {
      processQueue(err, null);
      processQueue(err, null);
      AuthService.clearAuthTokens();
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
