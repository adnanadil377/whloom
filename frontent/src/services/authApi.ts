import apiClient from './apiClient';
import type {
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  AuthResponse,
  MessageResponse,
  User,
} from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  signup: async (data: SignupRequest): Promise<MessageResponse> => {
    const res = await apiClient.post('/auth/signup', data);
    return res.data;
  },

  logout: async (): Promise<MessageResponse> => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    const res = await apiClient.post('/auth/forgot-password', data);
    return res.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    const res = await apiClient.post('/auth/reset-password', data);
    return res.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<MessageResponse> => {
    const res = await apiClient.post('/auth/verify-email', data);
    return res.data;
  },

  resendVerification: async (email: string): Promise<MessageResponse> => {
    const res = await apiClient.post('/auth/resend-verification', { email });
    return res.data;
  },

  googleLogin: () => {
    window.location.href = '/api/v1/auth/google';
  },
};
