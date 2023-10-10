import Cookies from 'js-cookie';
import { User } from '../user/user.dto';
import { LoginInput, AuthResponse, sendEmailForgotPasswordPayload, ResetPasswordPayload } from './auth.dto';
import { BaseResponse } from '@/common/dtos/base.dto';
import axiosInstance from '@/utils/axiosConfig';

const authService = {
  login: async (payload: LoginInput) => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload);

    Cookies.set('access_token', data.data.accessToken);

    return data;
  },
  logout: () => {
    Cookies.remove('access_token');
  },
  getCurrentUser: async () => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
      try {
        const { data } = await axiosInstance.get<BaseResponse<User>>('/users/me');

        return data.data;
      } catch (error) {
        const cookies = document.cookie.split(';');

        cookies.map((cookie) => {
          const [name, _] = cookie.split('=');

          Cookies.remove(name);
        });
      }
    } else {
      return null;
    }
  },
  sendEmailForgotPassword: async ({ email }: sendEmailForgotPasswordPayload) => {
    const { data } = await axiosInstance.post(`/auth/forgot-password/${email}`);

    return data;
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    const { data } = await axiosInstance.post('/auth/email/reset-password', payload);

    return data;
  },
};

export default authService;
