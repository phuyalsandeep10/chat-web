import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';
import axios from 'axios';
import {
  AuthTokens,
  ForgotPasswordPayload,
  ForgotPasswordVerifyPayload,
  RegisterPayload,
  resendOtpPayloads,
  ResetPasswordpayload,
  User,
  verify2FaPayload,
  VerifyEmailpayload,
} from './types';
import LanguageDropdown from '@/components/custom-components/Auth/common/LanguageDropdown';
import { Calligraffitti } from 'next/font/google';
import { resolve } from 'path';
import { UpdateProfileFormValues } from '@/components/custom-components/Settings/Accouints/AccountInformation/types';

export class AuthService {
  // Login User
  static async loginUser(data: User) {
    try {
      const res = await axios.post(`${baseURL}/auth/login`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // Register User
  static async registerUser(payload: RegisterPayload) {
    try {
      const response = await axios.post(`${baseURL}/auth/register`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get Authenticated User
  static async getAuthUser() {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  static async logoutUser() {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Verify Email
  static async verifyEmail(payload: VerifyEmailpayload) {
    try {
      const response = await axios.post(
        `${baseURL}/auth/verify-email`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Reset Password
  static async resetPassword(payload: ResetPasswordpayload) {
    try {
      const response = await axiosInstance.post(
        '/auth/reset-password',
        payload,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Forgot Password Request
  static async forgotPassword(payload: ForgotPasswordPayload) {
    try {
      const response = await axios.post(
        `${baseURL}/auth/forgot-password-request`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Forgot Password Verify
  static async forgotPasswordVerify(payload: ForgotPasswordVerifyPayload) {
    try {
      const response = await axios.post(
        `${baseURL}/auth/forgot-password-verify`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  // Forgot Password Verify
  static async resendOtp(payload: resendOtpPayloads) {
    try {
      const response = await axios.post(
        `${baseURL}/auth/resend-verification-token`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //refresh tokens
  static async refreshAccessToken(refreshToken: string): Promise<string> {
    const res = await axios.post(`${baseURL}/auth/refresh-token`, {
      token: refreshToken,
    });
    const { access_token } = res.data?.data;

    const currentTokens = this.getAuthTokens();
    if (!currentTokens) throw new Error('No tokens in localStorage');

    const newTokens: AuthTokens = {
      accessToken: access_token,
      refreshToken: currentTokens.refreshToken,
    };
    this.setAuthTokens(newTokens);

    return access_token;
  }

  // generate 2fa otp
  static async generate2FAOtp() {
    try {
      const response = await axiosInstance.post('/auth/2fa-otp/generate');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  // Verify 2fa otp
  static async verify2FAOtp(payload: verify2FaPayload) {
    try {
      const response = await axios.patch(
        `${baseURL}/auth/resend-verification-token`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  // Disable 2fa
  static async disable2Fa() {
    try {
      const response = await axiosInstance.post('/auth/2fa-disabled');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get Invitations
  static async getInvitations() {
    try {
      const response = await axiosInstance.get('/auth/invitations');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  // Validate email
  static async validateEmail(email: string) {
    try {
      const response = await axiosInstance.post('/auth/validate-email', {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get Auth Tokens from localStorage
  static getAuthTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem('authTokens');
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  }

  // Set Auth Tokens to localStorage
  static setAuthTokens(tokens: AuthTokens) {
    try {
      localStorage.setItem('authTokens', JSON.stringify(tokens));
    } catch (error) {
      console.error('Error setting auth tokens', error);
    }
  }

  // Clear Tokens
  static clearAuthTokens() {
    try {
      localStorage.removeItem('authTokens');
    } catch (error) {
      console.error('Error clearing auth tokens', error);
    }
  }

  // update account information
  static async updatePersonalInformation(payload: UpdateProfileFormValues) {
    try {
      const response = await axiosInstance.patch('/auth/profile', payload);
      console.log(payload.address);
      console.log('internal here');
      console.log(payload.name);
      console.log(payload.mobile);
      return response.data;
    } catch (error) {
      console.error('Error updating Personal Information');
    }
  }
}
