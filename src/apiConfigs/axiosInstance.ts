import { AuthService } from '@/services/auth/auth';
import axios from 'axios';

// export const baseURL = 'http://localhost:8000';
// export const baseURL = 'https://api.chatboq.com';
// export const baseURL = 'https://rv7r2p5f-8000.inc1.devtunnels.ms/';
// export const baseURL = 'http://192.168.1.78:8000';
export const baseURL = 'http://192.168.1.200:8000';

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
    const status = error?.status || originalRequest?.status;
    if (
      (!!status && status !== 401) ||
      originalRequest._retry ||
      originalRequest.url.includes('/auth/refresh')
    ) {
      console.log({
        originalRequest,
        status: error?.status,
        retry: originalRequest?._retry,
        includesRefresh: originalRequest?.url.includes('/auth/refresh'),
      });
      originalRequest._retry = false;

      return Promise.reject(error);
    }

    originalRequest._retry = true;
    console.log(isRefreshing, 'is refreshing');

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
      AuthService.clearAuthTokens();
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;

// In AuthService.refreshAccessToken

export async function refreshAccessToken(refreshToken: string) {
  const response = await axios.post(`${baseURL}/auth/refresh`, {
    refreshToken,
  });
  return response.data.accessToken;
}
