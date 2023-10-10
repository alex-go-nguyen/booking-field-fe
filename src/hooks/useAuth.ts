import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import Push from 'push.js';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as io from 'socket.io-client';
import { LoginInput } from '@/services/auth/auth.dto';
import authService from '@/services/auth/auth.service';
import { notificationKeys } from '@/services/notification/notification.query';
import { userKeys } from '@/services/user/user.query';

const NODE_ENV = import.meta.env.VITE_NODE_ENV;
export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(Cookies.get('access_token'));

  const userInstance = userKeys.profile();
  const { data: profile, isLoading, refetch, isFetched } = useQuery({ ...userInstance, staleTime: Infinity });

  const [socket, setSocket] = useState<io.Socket>();

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isLoading: loginLoading,
    isError: loginError,
  } = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      toast.success('Login successfully');
      refetch();
      setAccessToken(data.accessToken);
    },
  });

  async function login(payload: LoginInput) {
    loginMutation(payload);
  }

  function logout() {
    authService.logout();
    socket?.disconnect();
    refetch();
    toast.success('Logout successfully');
  }

  useEffect(() => {
    socket?.on('booking', (message) => {
      Push.create('Thông báo đặt sân', {
        body: message,
        icon: '/logo.png',
        timeout: 4000,
      });
      queryClient.invalidateQueries(notificationKeys.all);
    });

    socket?.on('update_venue_status', (message) => {
      Push.create('Thông báo từ quản trị viên', {
        body: message,
        icon: '/logo.png',
        timeout: 4000,
      });
      queryClient.invalidateQueries(notificationKeys.all);
    });

    return () => {
      socket?.off();
    };
  }, [socket]);

  useEffect(() => {
    if (accessToken) {
      const newSocket = io.connect(`${import.meta.env.VITE_SOCKET_API_URL}`, {
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        ...(NODE_ENV === 'production' && { withCredentials: true }),
      });

      setSocket(newSocket);
    }
  }, [accessToken]);

  return { profile, login, logout, isLoading, loginLoading, loginError, refetch, isFetched, socket };
};
